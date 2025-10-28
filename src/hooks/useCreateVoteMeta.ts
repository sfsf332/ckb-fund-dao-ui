"use client";

import { useState, useCallback } from "react";
import { createVoteMeta, CreateVoteMetaParams } from "@/server/proposal";
import useUserInfoStore from "@/store/userInfo";
import * as cbor from '@ipld/dag-cbor';
import { uint8ArrayToHex } from "@/lib/dag-cbor";
import storage from "@/lib/storage";
import { Secp256k1Keypair } from "@atproto/crypto";
import { useTranslation } from "@/utils/i18n";

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
    vote_type: number;
  }) => {
    try {
      // 1. 将params对象用cbor.encode编码
      const unsignedCommit = cbor.encode(params);
      
      // 2. 从storage获取signKey并创建keyPair
      const storageInfo = storage.getToken();
      if (!storageInfo?.signKey) {
        throw new Error(t("taskModal.errors.userNotLoggedIn"));
      }
      
      const keyPair = await Secp256k1Keypair.import(storageInfo.signKey.slice(2));
      
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
        vote_type: params.voteType,
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
      
      if (response.success) {
        return { success: true, data: response };
      } else {
        throw new Error(response.message || t("taskModal.errors.createVoteFailed"));
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

  // 清除错误状态
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createVoteMetaData,
    createReviewVote,
    isLoading,
    error,
    clearError,
  };
}
