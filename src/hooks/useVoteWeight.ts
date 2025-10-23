"use client";

import { useState, useEffect, useCallback } from "react";
import { getVoteWeight } from "@/server/proposal";
import { useWalletAddress } from "./useWalletAddress";

/**
 * 获取用户投票权重的 Hook
 * 提供获取用户投票权重的功能
 */
export function useVoteWeight() {
  const { walletAddress, isConnected } = useWalletAddress();
  const [voteWeight, setVoteWeight] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取投票权重
  const fetchVoteWeight = useCallback(async (ckb_addr?: string) => {
    const address = ckb_addr || walletAddress;
    
    if (!address) {
      setError("未找到CKB地址，请先连接钱包");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getVoteWeight({ ckb_addr: address });
      
      if (response && typeof response.weight === 'number') {
        setVoteWeight(response.weight);
      } else {
        throw new Error("获取投票权重失败：响应数据格式错误");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "获取投票权重失败";
      setError(errorMessage);
      console.error("获取投票权重失败:", error);
      setVoteWeight(0);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  // 当钱包地址变化时自动获取投票权重
  useEffect(() => {
    if (walletAddress && isConnected) {
      fetchVoteWeight();
    }
  }, [walletAddress, isConnected, fetchVoteWeight]);

  // 刷新投票权重
  const refreshVoteWeight = () => {
    fetchVoteWeight();
  };

  // 格式化投票权重显示
  const formatVoteWeight = (weight: number, showUnit: boolean = true) => {
    const formatted = weight.toLocaleString('zh-CN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    return showUnit ? `${formatted} 票` : formatted;
  };

  // 检查是否有投票权限（权重大于0）
  const hasVotingPower = voteWeight > 0;

  return {
    voteWeight,
    isLoading,
    error,
    fetchVoteWeight,
    refreshVoteWeight,
    formatVoteWeight,
    hasVotingPower,
    walletAddress,
    isConnected,
  };
}

/**
 * 获取指定CKB地址投票权重的 Hook
 * 用于获取其他用户的投票权重
 */
export function useVoteWeightByAddress(ckb_addr: string) {
  const [voteWeight, setVoteWeight] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ckb_addr) {
      setError("CKB地址不能为空");
      return;
    }

    const fetchVoteWeight = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getVoteWeight({ ckb_addr });
        
        if (response && typeof response.weight === 'number') {
          setVoteWeight(response.weight);
        } else {
          throw new Error("获取投票权重失败：响应数据格式错误");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "获取投票权重失败";
        setError(errorMessage);
        console.error("获取投票权重失败:", error);
        setVoteWeight(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoteWeight();
  }, [ckb_addr]);

  // 格式化投票权重显示
  const formatVoteWeight = (weight: number, showUnit: boolean = true) => {
    const formatted = weight.toLocaleString('zh-CN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    return showUnit ? `${formatted} ` : formatted;
  };

  // 检查是否有投票权限（权重大于0）
  const hasVotingPower = voteWeight > 0;

  return {
    voteWeight,
    isLoading,
    error,
    formatVoteWeight,
    hasVotingPower,
  };
}
