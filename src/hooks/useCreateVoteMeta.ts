"use client";

import { useState, useCallback } from "react";
import { createVoteMeta, CreateVoteMetaParams, CreateVoteMetaResponse } from "@/server/proposal";
import useUserInfoStore from "@/store/userInfo";
import * as cbor from '@ipld/dag-cbor';
import { uint8ArrayToHex, hexToUint8Array } from "@/lib/dag-cbor";
import storage from "@/lib/storage";
import { Secp256k1Keypair } from "@atproto/crypto";
import { useTranslation } from "@/utils/i18n";
import { ccc } from "@ckb-ccc/core";

/**
 * 创建投票元数据的 Hook
 * 提供提交投票元数据到 /api/vote/create_vote_meta 接口的功能
 */
export function useCreateVoteMeta() {
  const { userInfo } = useUserInfoStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // 生成signed_bytes
  const generateSignedBytes = useCallback(async (params: {
    candidates: unknown[];
    end_time: number;
    proposal_uri: string;
    start_time: number;
  }) => {
    try {
      console.log('params', params);
      // 1. 将params对象用cbor.encode编码
      const unsignedCommit = cbor.encode(params);
      console.log('unsignedCommit', unsignedCommit);
      // 2. 从storage获取signKey并创建keyPair
      const storageInfo = storage.getToken();
      if (!storageInfo?.signKey) {
        throw new Error(t("taskModal.errors.userNotLoggedIn"));
      }
      
      const keyPair = await Secp256k1Keypair.import(storageInfo?.signKey?.slice(2))

      // 3. 用keyPair.sign签名

      const signature = await keyPair.sign(unsignedCommit);
      
      // 4. 转换为hex字符串
      const signedBytes = uint8ArrayToHex(signature);
      
      return signedBytes;
    } catch (error) {
      console.error(t("voteMeta.createVoteMetaFailed"), error);
      throw new Error(t("taskModal.errors.signatureFailed"));
    }
  }, [t]);

  // 创建投票元数据
  const createVoteMetaData = useCallback(async (params: {
    proposalUri: string;
    voteType: number;
    startTime: number;
    endTime: number;
    candidates?: unknown[];
    signedBytes?: string;
    signingKeyDid?: string;
  }) => {
    if (!userInfo?.did) {
      setError(t("taskModal.errors.userNotLoggedIn"));
      return { success: false, error: t("taskModal.errors.userNotLoggedIn") };
    }

    try {
      setIsLoading(true);
      setError(null);

      // 构建参数对象
      const voteParams = {
        candidates: params.candidates || ([] as unknown[]),
        end_time: params.endTime,
        proposal_uri: params.proposalUri,
        start_time: params.startTime,
      };

      // 生成signed_bytes
      const signedBytes = params.signedBytes || await generateSignedBytes(voteParams);
      
      // 获取signing_key_did
      const storageInfo = storage.getToken();
      if (!storageInfo?.signKey) {
        throw new Error(t("taskModal.errors.userNotLoggedIn"));
      }
      const keyPair = await Secp256k1Keypair.import(storageInfo.signKey.slice(2));
      const signingKeyDid = keyPair.did();

      const voteMetaParams: CreateVoteMetaParams = {
        did: userInfo.did,
        params: voteParams,
        signed_bytes: signedBytes,
        signing_key_did: params.signingKeyDid || signingKeyDid,
      };

      const response = await createVoteMeta(voteMetaParams);
      
      // API 返回格式: {code: 200, data: {outputsData: [...], vote_meta: {...}}, message: "OK"}
      // requestAPI 会自动提取 data 字段，所以 response 应该是 {outputsData: [...], vote_meta: {...}}
      if (response && response.vote_meta) {
        return { 
          success: true, 
          data: response,
          voteId: response.vote_meta.id,
          voteMeta: response.vote_meta
        };
      } else {
        throw new Error(t("taskModal.errors.createVoteFailed"));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("taskModal.errors.createVoteFailed");
      
      // 处理特定的错误类型
      let displayMessage = errorMessage;
      if (errorMessage.includes("not administrator")) {
        displayMessage = t("taskModal.errors.insufficientPermissions");
      } else if (errorMessage.includes("administrator") && errorMessage.includes("does not exist")) {
        displayMessage = t("taskModal.errors.systemError");
      } else if (errorMessage.includes(t("voteMeta.userSignKeyNotExists"))) {
        displayMessage = t("taskModal.errors.userNotLoggedIn");
      } else if (errorMessage.includes(t("voteMeta.signatureGenerationFailed"))) {
        displayMessage = t("taskModal.errors.signatureFailed");
      }
      
      setError(displayMessage);
      console.error(t("voteMeta.createVoteMetaError"), error);
      return { success: false, error: displayMessage };
    } finally {
      setIsLoading(false);
    }
  }, [userInfo?.did, generateSignedBytes, t]);

  // 为社区审议中的提案创建投票
  const createReviewVote = useCallback(async (proposalUri: string) => {
    const now = Date.now();
    const startTime = now;
    const endTime = now + (3 * 24 * 60 * 60 * 1000); // 3天后结束投票

    return createVoteMetaData({
      proposalUri,
      voteType: 1, // 社区审议投票类型
      startTime: Math.floor(startTime / 1000), // 转换为秒
      endTime: Math.floor(endTime / 1000), // 转换为秒
      candidates: [], // 社区审议投票通常没有候选人
    });
  }, [createVoteMetaData]);

  // 根据 API 返回的 outputsData 组装并发送交易
  // 参照: https://github.com/web5fans/web5-components/blob/dev/vote/create-vote-meta/src/index.ts
  // 和 https://github.com/web5fans/web5-components/blob/dev/vote/create-vote-meta/src/molecules.ts
  const buildAndSendTransaction = useCallback(async (
    response: CreateVoteMetaResponse,
    signer: any
  ) => {
    if (!signer) {
      throw new Error(t("wallet.signerNotConnected"));
    }

    try {
      // 获取钱包地址
      const addresses = await signer.getAddresses();
      if (!addresses || addresses.length === 0) {
        throw new Error(t("wallet.cannotGetAddress"));
      }

      const fromAddress = addresses[0];
      
      // 获取锁定脚本和客户端
      const cccClient = signer.client_ || new ccc.ClientPublicTestnet();
      const { script: lock } = await ccc.Address.fromString(fromAddress, cccClient);

      // 解析 outputsData（每个元素是十六进制字符串，代表编码后的输出数据）
      // outputsData 是 molecules 编码的数据，需要与对应的 outputs 配对
      // 根据 web5-components 的结构，outputsData[0] 包含投票元数据的编码
      const outputsData = response.outputsData.map((hexStr: string) => {
        // 确保是 0x 开头的格式
        const hex = hexStr.startsWith('0x') ? hexStr : `0x${hexStr}`;
        return hex;
      });

      // 注意：根据投票合约的实际结构，可能需要：
      // 1. 解析 outputsData 来确定 type script 和输出结构
      // 2. 或者 outputs 信息已经包含在 API 返回的其他字段中
      // 这里我们假设 outputsData 对应一个输出，需要构建对应的 output
      // 实际的 type script 应该从投票合约的配置中获取

      // 创建交易 - 先创建初始结构
      // 由于我们不知道完整的 outputs 结构，先创建默认交易，然后设置数据
      const tx = ccc.Transaction.default();

      // 完成输入（至少需要一个输入来支付费用）
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await tx.completeInputsAtLeastOne(signer as any);

      // 如果 outputsData 不为空，创建对应的输出
      // 注意：这里需要根据实际的投票合约来设置 type script
      // 由于我们没有合约的详细信息，这里使用一个通用结构
      if (outputsData.length > 0) {
        // 创建输出数组
        // 实际使用时，需要根据投票合约来设置 type script
        // 这里假设每个 outputsData 对应一个输出，使用相同的 lock script
        const outputs = outputsData.map(() => ({
          lock,
          // type script 需要根据实际的投票合约来设置
          // 如果 API 没有返回 type script 信息，可能需要从配置或 molecules 解析
        }));

        // 使用 Transaction.from 重新创建包含输出的交易
        // 或者使用现有的方法设置输出
        // 注意：Transaction API 可能不支持直接设置 outputs，需要重新构建
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentInputs = (tx as any).inputs || [];
        
        // 重新创建交易，包含完整的结构
        const newTx = ccc.Transaction.from({
          inputs: currentInputs,
          outputs: outputs,
          outputsData: outputsData,
        });

        // 如果有 cell deps，需要添加
        // 这里可能需要从投票合约配置中获取
        // await newTx.addCellDepInfos(cccClient, cellDeps);

        // 完成费用计算
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await newTx.completeFeeBy(signer as any);

        // 签名并发送
        await signer.signTransaction(newTx);
        const txHash = await signer.sendTransaction(newTx);
        
        console.log("投票交易已发送:", txHash);
        
        return {
          success: true,
          txHash,
          voteMeta: response.vote_meta
        };
      } else {
        // 如果没有 outputsData，只完成费用和发送
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await tx.completeFeeBy(signer as any);
        await signer.signTransaction(tx);
        const txHash = await signer.sendTransaction(tx);
        
        return {
          success: true,
          txHash,
          voteMeta: response.vote_meta
        };
      }
    } catch (error) {
      console.error("构建或发送交易失败:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`交易构建失败: ${errorMessage}`);
    }
  }, [t]);

  // 清除错误状态
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createVoteMetaData,
    createReviewVote,
    buildAndSendTransaction,
    isLoading,
    error,
    clearError,
  };
}
