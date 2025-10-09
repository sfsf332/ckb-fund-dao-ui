"use client";

import React from "react";
import Image from "next/image";
import { FaCopy } from "react-icons/fa";
import { useWalletAddress } from "@/hooks/useWalletAddress";

interface LoginStep4Props {
  accountName: string;
}

export default function LoginStep4({ accountName }: LoginStep4Props) {
  
  const { walletAddress, isLoadingAddress, copyAddress, formatAddress } = useWalletAddress();

  // 复制地址到剪贴板
  const handleCopyAddress = async () => {
    const success = await copyAddress();
    if (success) {
      console.log("✅ 地址已复制到剪贴板");
    } else {
      console.log("❌ 地址复制失败");
    }
  };
  return (
    <div className="login-info-section">
      <h3 className="login-info-title">账号创建成功!</h3>
      <p className="success-description">
        您的Web5 DID账号已成功创建并上链存储。现在您可以参与社区治理，发布提案和参与讨论了。
      </p>
      <div className="success-info">
        <div className="success-card">
          <div className="success-head">
            <div className="card-img">
              <Image src="/nervos-planet.png" alt="planet" width={60} height={32} />
            </div>
            <div className="card-name">
              {accountName || "alice"}
            </div>
          </div>
          <div className="success-details">
            <div className="success-name">
              {accountName || "alice"}.ckb.xyz
            </div>
            <div className="success-address" onClick={handleCopyAddress} style={{ cursor: 'pointer' }}>
              {isLoadingAddress ? "获取地址中..." : formatAddress(walletAddress)} 
              <FaCopy style={{ marginLeft: '8px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
