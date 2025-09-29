"use client";

import { useState, useEffect, useRef } from "react";
import getPDSClient from "@/lib/pdsClient";
import storage, { TokenStorageType } from "@/lib/storage";
import { Secp256k1Keypair } from "@atproto/crypto";
import { bytesFrom, hexFrom, ccc, Script, numFrom, fixedPointToString } from "@ckb-ccc/core";
import { ComAtprotoWeb5IndexAction, ComAtprotoWeb5PreIndexAction } from "web5-api";
import * as cbor from "@ipld/dag-cbor";
import { tokenConfig } from "@/constant/token";
import { useWallet } from "@/provider/WalletProvider";

// import { DidWeb5Data } from "@/lib/molecules"; // 暂时不使用，避免序列化问题
import useUserInfoStore from "@/store/userInfo";
// import { base32 } from "@scure/base";
import { hexToUint8Array, uint8ArrayToHex } from "@/lib/dag-cbor";
// import { UnsignedCommit } from "@atproto/repo";
// import { CID } from "multiformats";
import server from "@/server";
import { UserProfileType } from "@/store/userInfo";

export enum CREATE_STATUS {
  INIT,
  SUCCESS,
  FAILURE
}

export type CreateAccountStatus = { status: CREATE_STATUS; reason?: string }

// 类型定义
export interface CkbBalanceResult {
  isEnough: boolean;
  expectedCapacity?: string;
  error?: string;
}

export interface ExtraIsEnoughState {
  capacity: string;
  isEnough: boolean;
}

type CreateUserParamsType = {
  did?: string
  createdTx?: ccc.Transaction
  createdSignKeyPriv?: string
}

const initialCapacity = 355
const SEND_TRANSACTION_ERR_MESSAGE = 'SendTransaction Error'

export async function fetchUserProfile(did: string): Promise<UserProfileType> {
  const result = await server<UserProfileType>('/repo/profile', 'GET', {
    repo: did
  })
  return result
}

export async function userLogin(localStorage: TokenStorageType): Promise<ComAtprotoWeb5IndexAction.CreateSessionResult | undefined> {
  const pdsClient = getPDSClient()
  const { did, signKey, walletAddress } = localStorage

  const preLoginIndex = {
    $type: 'com.atproto.web5.preIndexAction#createSession',
  }

  let preLogin: ComAtprotoWeb5PreIndexAction.Response

  try {
    preLogin = await pdsClient.com.atproto.web5.preIndexAction({
      did,
      ckbAddr: walletAddress,
      index: preLoginIndex,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err && err.error === 'CkbDidocCellNotFound') {
      console.log('CkbDidocCellNotFound')
      await deleteErrUser(did, walletAddress, signKey)
      return
    } else {
      console.error('preIndexAction 发生未知错误:', err)
      return
    }
  }

  if (!preLogin || !preLogin.data || !preLogin.data.message) return

  // 确保私钥格式正确
  const signKeyStr = typeof signKey === 'string' ? signKey : String(signKey);
  const cleanSignKey = signKeyStr.startsWith('0x') ? signKeyStr.slice(2) : signKeyStr;
  
  const keyPair = await Secp256k1Keypair.import(cleanSignKey)
  const loginSig = await keyPair.sign(
    bytesFrom(preLogin.data.message, 'utf8'),
  )

  const loginIndex = {
    $type: 'com.atproto.web5.indexAction#createSession',
  }

  const signingKey = keyPair.did()

  try {
    const loginInfo = await pdsClient.web5Login({
      did,
      message: preLogin.data.message,
      signingKey: signingKey,
      signedBytes: hexFrom(loginSig),
      ckbAddr: walletAddress,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      index: loginIndex as any,
    })
    return loginInfo.data.result as ComAtprotoWeb5IndexAction.CreateSessionResult

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('登录失败:', err);
    alert('登录失败')
  }
}

export async function deleteErrUser(did: string, address: string, signKey: string) {
  const preDelectIndex = {
    $type: 'com.atproto.web5.preIndexAction#deleteAccount',
  }
  const pdsClient = getPDSClient()
  const preDelete = await pdsClient.com.atproto.web5.preIndexAction({
    did,
    ckbAddr: address,
    index: preDelectIndex,
  })

  // 确保私钥格式正确
  const signKeyStr = typeof signKey === 'string' ? signKey : String(signKey);
  const cleanSignKey = signKeyStr.startsWith('0x') ? signKeyStr.slice(2) : signKeyStr;
  
  const keyPair = await Secp256k1Keypair.import(cleanSignKey)
  const signingKey = keyPair.did()
  const deleteSig = await keyPair.sign(
    bytesFrom(preDelete.data.message, 'utf8'),
  )

  const deleteIndex = {
    $type: 'com.atproto.web5.indexAction#deleteAccount',
  }

  await pdsClient.com.atproto.web5.indexAction({
    did,
    message: preDelete.data.message,
    signingKey,
    signedBytes: hexFrom(deleteSig),
    ckbAddr: address,
    index: deleteIndex,
  })

  storage.removeToken()
  console.log('web5 delete account finish')
}

// 完整的创建账户 Hook
export default function useCreateAccount({ createSuccess }: {
  createSuccess?: () => void
}) {
  const { createUser, resetUserStore } = useUserInfoStore()
  const { signer, walletClient, address } = useWallet()

  const [extraIsEnough, setExtraIsEnough] = useState<ExtraIsEnoughState>({
    capacity: initialCapacity.toString(),
    isEnough: false
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [createStatus, setCreateStatus] = useState<CreateAccountStatus>({
    status: CREATE_STATUS.INIT
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const createUserParamsRef = useRef<CreateUserParamsType>({
    did: undefined,
    createdTx: undefined,
    createdSignKeyPriv: undefined
  })

  const changeParams = (obj: CreateUserParamsType) => {
    createUserParamsRef.current = {...createUserParamsRef.current, ...obj}
  }

  // 判断CKB是否足够
  const validateIsEnough = async (userHandle: string) => {
    if (!signer) return false
    
    try {
      const fromAddress = await signer.getAddresses()

      const keyPair = await Secp256k1Keypair.create({
        exportable: true
      })
      const signKeyPriv = await keyPair.export()
      
      // 确保私钥是Uint8Array格式
      let privateKeyBytes: Uint8Array;
      if (signKeyPriv instanceof Uint8Array) {
        privateKeyBytes = signKeyPriv;
      } else if (typeof signKeyPriv === 'string') {
        // 如果是字符串，转换为Uint8Array
        const hexStr = signKeyPriv as string;
        const cleanHex = hexStr.startsWith('0x') ? hexStr.slice(2) : hexStr;
        privateKeyBytes = new Uint8Array(cleanHex.match(/.{2}/g)?.map((byte: string) => parseInt(byte, 16)) || []);
      } else {
        throw new Error('私钥格式不正确');
      }
      
      const strSignKeyPriv = ccc.hexFrom(privateKeyBytes)
      const signingKey = keyPair.did()

      const diDoc = {
        verificationMethods: {
          atproto: signingKey,
        },
        alsoKnownAs: [`at://${userHandle}`],
        services: {
          atproto_pds: {
            type: 'AtprotoPersonalDataServer',
            endpoint: getPDSClient().serviceUrl.origin,
          },
        },
      }
        // 简化DID数据，避免复杂的序列化问题
        const didDocBytes = cbor.encode(diDoc);
        const didWeb5Data0Str = hexFrom(didDocBytes);
        
        console.log('DID文档编码成功:', didWeb5Data0Str.substring(0, 50) + '...');

      const { script: lock } = await ccc.Address.fromString(
        fromAddress[0],
        signer.client as never,
      )

      let cell = null

      for await (const c of signer.findCells(
        {
          scriptLenRange: [0, 1],
          outputDataLenRange: [0, 1],
        },
        true,
        'desc',
        1,
      )) {
        cell = c
      }
      
      if (!cell) {
        startPolling(userHandle)
        return false
      }

      const input = ccc.CellInput.from({ previousOutput: cell.outPoint })

      const args = ccc.hashCkb(
        ccc.bytesConcat(input.toBytes(), ccc.numLeToBytes(0, 8)),
      )

      const type = new Script(tokenConfig.codeHash, tokenConfig.hashType, args)

      

      const tx = ccc.Transaction.from({
        inputs: [{ previousOutput: input.previousOutput }],
        outputs: [{ lock, type }],
        outputsData: [didWeb5Data0Str],
      })
      
      await tx.addCellDepInfos(signer.client as unknown as never, tokenConfig.cellDeps as never)

      try {
        await tx.completeInputsByCapacity(signer as unknown as never)
        setExtraIsEnough({ capacity: "0", isEnough: true })
      } catch {
        const expectedCapacity = fixedPointToString(tx.getOutputsCapacity() + numFrom(0))
        setExtraIsEnough({ capacity: expectedCapacity, isEnough: false })
        startPolling(userHandle)
        return false
      }

      await tx.completeFeeBy(signer as unknown as never)

     debugger

      // 简化的DID生成，避免依赖base32
      const preDid = hexToUint8Array(args.slice(2, 42)).toString().replace(/,/g, '')
      console.log('签名后的交易:', tx);
      changeParams({
        createdTx: tx,
        did: `did:web5:${preDid}`,
        createdSignKeyPriv: strSignKeyPriv
      })
      
      return true
    } catch (error) {
      console.error('验证余额时发生错误:', error)
      return false
    }
  }

  // 启动轮询
  const startPolling = (userHandle: string) => {
    if (intervalRef.current) return

    intervalRef.current = setInterval(async () => {
      await validateIsEnough(userHandle)
    }, 10000);
  };

  // 停止轮询
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const prepareAccount = async (userHandle: string, address: string) => {
    setCreateLoading(true)

    const signKey = createUserParamsRef.current.createdSignKeyPriv

    // 检查私钥是否存在且格式正确
    if (!signKey) {
      throw new Error('私钥未生成，请重新验证余额');
    }

    // 确保私钥是字符串格式
    const signKeyStr = typeof signKey === 'string' ? signKey : String(signKey);
    
    // 移除0x前缀并确保是有效的十六进制字符串
    const cleanSignKey = signKeyStr.startsWith('0x') ? signKeyStr.slice(2) : signKeyStr;
    

    const keyPair = await Secp256k1Keypair.import(cleanSignKey)

    const signingKey = keyPair.did()

    const res = await getPDSClient().com.atproto.web5.preCreateAccount({
      handle: userHandle,
      signingKey,
      did: createUserParamsRef.current.did || '',
    })

    const preCreateResult = res.data
    
    console.log('preCreateResult完整结构:', JSON.stringify(preCreateResult, null, 2));

    // 直接使用服务器提供的unSignBytes，不进行任何计算
    console.log('使用服务器提供的unSignBytes:', preCreateResult.unSignBytes);
    
    // 将十六进制字符串转换为Uint8Array用于签名
    const encoded = hexToUint8Array(preCreateResult.unSignBytes);

    // 手动签名commit
    const sig = await keyPair.sign(encoded)
    const commit =  {
      did: preCreateResult.did,
      version: 3,
      rev: preCreateResult.rev,
      prev: preCreateResult.prev ?? null,
      data: preCreateResult.data,
      sig,
    }

    await createUser({
      handle: userHandle!,
      password: signKey,
      signingKey,
      ckbAddr: address,
      root: {
        did: preCreateResult.did,
        version: 3,
        rev: preCreateResult.rev,
        prev: preCreateResult.prev,
        data: preCreateResult.data,
        signedBytes: uint8ArrayToHex(commit.sig),
      },
    })

    let txHash;
    const createdTx = createUserParamsRef.current.createdTx

    console.log('准备发送交易:');
    console.log('- 交易对象:', createdTx);
    console.log('- 交易输入数量:', createdTx?.inputs?.length);
    console.log('- 交易输出数量:', createdTx?.outputs?.length);
    console.log('- 交易输出数据:', createdTx?.outputsData);

    try {
      txHash = await signer?.sendTransaction(createdTx! as unknown as never)
      console.log('txHash', txHash)
    } catch (error) {
      console.error('发送交易失败:', error);
      throw new Error(SEND_TRANSACTION_ERR_MESSAGE);
    }

    console.log('txHash', txHash)
    if (!txHash) return
    
    const txRes = await walletClient?.waitTransaction(txHash, 0, 60000 * 2)
    console.log('txRes', txRes)
    
    if (txRes?.status !== 'committed') {
      await deleteErrUser(preCreateResult.did, address, signKey!)
    }

    setCreateLoading(false)
    createSuccess?.()
    setCreateStatus({
      status: CREATE_STATUS.SUCCESS,
      reason: undefined
    })
  }

  const createAccount = async (
    signer: ccc.Signer, 
    walletClient: ccc.Client, 
    userHandle: string, 
    address: string
  ) => {
    stopPolling()

    try {
      // 确保私钥已生成，如果没有则重新验证余额
      if (!createUserParamsRef.current.createdSignKeyPriv) {
        setCreateLoading(true)
        const flag = await validateIsEnough(userHandle)
        if (!flag) {
          setCreateLoading(false)
          return
        }
      }
      
      await prepareAccount(userHandle, address)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error('创建账户过程中发生错误:', err)
      console.log('err.message', errorMessage)

      if (errorMessage === SEND_TRANSACTION_ERR_MESSAGE) {
        console.log('检测到交易发送错误，清理已创建的用户数据')
        const params = createUserParamsRef.current
        await deleteErrUser(params.did!, address, params.createdSignKeyPriv!)
      }

      resetUserStore()

      setCreateLoading(false)
      setCreateStatus({
        status: CREATE_STATUS.FAILURE,
        reason: errorMessage
      })
      changeParams({
        did: undefined,
        createdTx: undefined,
        createdSignKeyPriv: undefined,
      })
    }
  }



  useEffect(() => {
    stopPolling();
    setCreateStatus({
      status: CREATE_STATUS.INIT,
      reason: undefined
    })
    setExtraIsEnough({ capacity: initialCapacity.toString(), isEnough: false })
  }, []);

  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, []);

  return {
    extraIsEnough,
    createAccount,
    loading: createLoading,
    createStatus,
    resetCreateStatus: () => {
      setCreateStatus(prev => ({
        ...prev,
        status: CREATE_STATUS.INIT
      }))
    }
  }
}