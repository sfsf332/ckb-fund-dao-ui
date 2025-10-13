
import getPDSClient from "@/lib/pdsClient";
import storage, { TokenStorageType } from "@/lib/storage";
import { Secp256k1Keypair } from "@atproto/crypto";
import { bytesFrom, hexFrom } from "@ckb-ccc/core";
import { ComAtprotoWeb5IndexAction, ComAtprotoWeb5PreIndexAction } from "web5-api";
// import { showGlobalToast } from "@/provider/toast";
import server from "@/server";
import { UserProfileType } from "@/store/userInfo";

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

  // 修复：在赋值前使用了变量“preLogin”
  if (!preLogin || !preLogin.data || !preLogin.data.message) return

  const keyPair = await Secp256k1Keypair.import(signKey?.slice(2))
  const loginSig = await keyPair.sign(
    bytesFrom(preLogin.data.message, 'utf8'),
  )
  
 

  const loginIndex = {
    $type: 'com.atproto.web5.indexAction#createSession',
  }

  const signingKey = keyPair.did()

  try {
    const loginInfo = await pdsClient.com.atproto.web5.indexAction({
      did,
      message: preLogin.data.message,
      signingKey: signingKey,
      signedBytes: hexFrom(loginSig),
      ckbAddr: walletAddress,
      index: loginIndex,
    })
    
    const result = loginInfo.data.result as ComAtprotoWeb5IndexAction.CreateSessionResult
    
    // 🔧 关键修复：通过 sessionManager 设置 session，这样后续请求才能带上 accessJwt
    pdsClient.sessionManager.session = {
      ...result,
      active: result.active ?? true
    }
    
    console.log('✅ Session 已设置:', pdsClient.sessionManager.session)
    
    return result

  } catch (err) {
    console.error('登录失败:', err);
    // alert("登录失败")
    // showGlobalToast({
    //   title: '登录失败',
    //   icon: 'error',
    //   duration: 4000
    // })
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

  const keyPair = await Secp256k1Keypair.import(signKey?.slice(2))
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