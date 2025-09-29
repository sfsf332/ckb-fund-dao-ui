"use client";

import React from "react";
import Image from "next/image";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { ccc } from "@ckb-ccc/connector-react";

interface LoginStep1Props {
  onDisconnect?: () => void;
  onSwitchWallet?: () => void;
}

export default function LoginStep1({ onDisconnect, onSwitchWallet }: LoginStep1Props) {
  const { wallet, signerInfo } = ccc.useCcc();
  const isConnected = !!wallet && !!signerInfo;
  
  return (
    <>
      <div className="login-content">
        <div className="login-info-section">
          <h3 className="login-info-title">
            创建您的个人<span className="web5-highlight">Web5</span>{" "}
            DID账号,获得:
          </h3>
          <ul className="login-benefits">
            <li>存储于CKB链的数据档案库</li>
            <li>发布提案和参与回帖讨论的权限</li>
            <li>专属域名(如alice.ckb.xyz)</li>
          </ul>
          {isConnected && (
            <div className="wallet-status">
              <p className="wallet-connected">✅ 钱包已连接</p>
              <p className="wallet-address">钱包: 已连接</p>
              <div className="wallet-controls">
                <button 
                  className="wallet-control-btn disconnect-btn"
                  onClick={onDisconnect}
                >
                  断开连接
                </button>
                <button 
                  className="wallet-control-btn switch-btn"
                  onClick={onSwitchWallet}
                >
                  切换钱包
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="login-graphic-section">
          <Image src="/login-bg.png" alt="login-graphic" width={224} height={160} />
        </div>
      </div>
      <div>
        <a href="#" className="login-info-link">
          什么是Web5?
          <IoMdInformationCircleOutline
            data-tooltip-id="my-tooltip"
            data-tooltip-content="web5的含义"
          />
        </a>
      </div>
    </>
  );
}
