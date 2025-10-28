"use client";

import { useState, useCallback } from "react";
import { createVoteMeta, CreateVoteMetaParams } from "@/server/proposal";
import useUserInfoStore from "@/store/userInfo";
import * as cbor from '@ipld/dag-cbor';
import { uint8ArrayToHex } from "@/lib/dag-cbor";
import storage from "@/lib/storage";
import { Secp256k1Keypair } from "@atproto/crypto";

/**
 * 创建投票元数据的 Hook
 * 提供提交投票元数据到 /api/vote/create_vote_meta 接口的功能
 */
export function useCreateVoteMeta() {
  const { userInfo } = useUserInfoStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error("用户签名密钥不存在");
      }
      
      const keyPair = await Secp256k1Keypair.import(storageInfo.signKey.slice(2));
      
      // 3. 用keyPair.sign签名
      const signature = await keyPair.sign(unsignedCommit);
      
      // 4. 转换为hex字符串
      const signedBytes = uint8ArrayToHex(signature);
      
      return signedBytes;
    } catch (error) {
      console.error("生成signed_bytes失败:", error);
      throw new Error("生成签名失败");
    }
  }, []);

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
      setError("用户未登录，请先登录");
      return { success: false, error: "用户未登录" };
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
        throw new Error("用户签名密钥不存在");
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
        throw new Error(response.message || "创建投票元数据失败");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "创建投票元数据失败";
      
      // 处理特定的错误类型
      let displayMessage = errorMessage;
      if (errorMessage.includes("not administrator")) {
        displayMessage = "权限不足：您不是管理员，无法创建投票";
      } else if (errorMessage.includes("administrator") && errorMessage.includes("does not exist")) {
        displayMessage = "系统错误：管理员权限配置异常，请联系技术支持";
      } else if (errorMessage.includes("用户签名密钥不存在")) {
        displayMessage = "用户未登录或登录已过期，请重新登录";
      } else if (errorMessage.includes("生成签名失败")) {
        displayMessage = "签名生成失败，请检查网络连接后重试";
      }
      
      setError(displayMessage);
      console.error("创建投票元数据失败:", error);
      return { success: false, error: displayMessage };
    } finally {
      setIsLoading(false);
    }
  }, [userInfo?.did, generateSignedBytes]);

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
