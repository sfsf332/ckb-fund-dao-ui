"use client";

import React from "react";
import Image from "next/image";
import { useWalletAddress } from "@/hooks/useWalletAddress";
import { handleCopy } from "@/utils/common";
import CopyButton from "../ui/copy/CopyButton";

interface LoginStep4Props {
  accountName: string;
}

export default function LoginStep4({ accountName }: LoginStep4Props) {
  
  const { walletAddress, isLoadingAddress, formatAddress } = useWalletAddress();

  // 复制地址到剪贴板
  const handleCopyAddress = () => {
    if (walletAddress) {
      handleCopy(walletAddress);
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
              <CopyButton text={walletAddress} className="copy-button" ariaLabel="copy-wallet-address" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
