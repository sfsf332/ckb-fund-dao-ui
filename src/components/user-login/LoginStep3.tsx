"use client";

import React from "react";
import Image from "next/image";
import { useWalletAddress } from "@/hooks/useWalletAddress";
import { handleCopy } from "@/utils/common";
import { CreateAccountStatus, CREATE_STATUS } from "@/hooks/createAccount";
import { ExtraIsEnoughState } from "@/hooks/checkCkb";
import CopyButton from "../ui/copy/CopyButton";
import { useTranslation } from "@/utils/i18n";

interface LoginStep3Props {
  accountName: string;
  isDragging: boolean;
  isDropped: boolean;
  showInsufficientFunds: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onRecheckBalance?: () => void;
  createLoading?: boolean;
  createStatus?: CreateAccountStatus;
  // 余额检查相关属性
  balanceLoading?: boolean;
  extraIsEnough?: ExtraIsEnoughState;
  balanceError?: string | null;
}

export default function LoginStep3({
  accountName,
  isDragging,
  isDropped,
  showInsufficientFunds,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onRecheckBalance,
  createLoading = false,
  createStatus,
  balanceLoading = false,
  extraIsEnough,
  balanceError,
}: LoginStep3Props) {
  const { t } = useTranslation();
  const { walletAddress, isLoadingAddress, formatAddress } = useWalletAddress();
  // 复制地址到剪贴板（统一行为+toast）
  const handleCopyAddress = () => {
    if (walletAddress) {
      handleCopy(walletAddress, t("copy.addressSuccess"));
    }
  };
  return (
    <div className="login-info-section">
      <h3 className="login-info-title">
        拖动您的小行星到 Nervos 星系,完成上链操作。
      </h3>
      <p className="login-description">
        授权后即可在区块链上永久存储您的Web5账号数据,不可被第三方篡改。
      </p>
      <div className="drag-drop-container">
        <div className="drag-source">
          <div
            className={`planet-account ${isDragging ? "dragging" : ""}`}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <Image
              src="/nervos-planet.png"
              alt="planet"
              width={75}
              height={40}
            />
          </div>
          <div className="account-info">
            <div className="account-name">
              {accountName || "alice"}
            </div>
            <div className="account-address" style={{ cursor: 'pointer' }}>
              {isLoadingAddress ? "获取地址中..." : formatAddress(walletAddress)} 
              <CopyButton text={walletAddress} className="copy-button" ariaLabel="copy-wallet-address" />
            </div>
          </div>
          
          {/* 余额状态显示 - 只在余额不足时显示 */}
          {extraIsEnough && !extraIsEnough.isEnough && (
            <div style={{
              marginTop: '8px',
              padding: '8px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '4px',
              fontSize: '12px',
              color:'#333'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                ⚠️ 余额不足
              </div>
              <div>
                所需容量: 355 CKB
              </div>
              {balanceLoading && (
                <div style={{ marginTop: '4px', fontStyle: 'italic' }}>
                  正在检查余额...
                </div>
              )}
              {balanceError && (
                <div style={{ marginTop: '4px', color: '#dc3545' }}>
                  错误: {balanceError}
                </div>
              )}
            </div>
          )}
          {showInsufficientFunds && (
            <div className="insufficient-funds-warning">
              需要至少355CKB才能上链存储信息, 请补充CKB或切换有充足CKB的钱包。
              {onRecheckBalance && (
                <button 
                  className="recheck-balance-btn" 
                  onClick={onRecheckBalance}
                  style={{ 
                    marginTop: '8px', 
                    padding: '4px 8px', 
                    fontSize: '12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  重新检查余额
                </button>
              )}
            </div>
          )}

          {/* 创建账户状态显示 */}
          {createLoading && (
            <div className="create-account-loading" style={{ 
              marginTop: '8px', 
              padding: '8px', 
              backgroundColor: '#f0f8ff',
              border: '1px solid #007bff',
              borderRadius: '4px',
              textAlign: 'center',
              color:'#333'
            }}>
              <div>正在创建账户...</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                请稍候，这可能需要几分钟时间
              </div>
            </div>
          )}

          {createStatus?.status === CREATE_STATUS.FAILURE && (
            <div className="create-account-error" style={{ 
              marginTop: '8px', 
              padding: '8px', 
              backgroundColor: '#ffe6e6',
              border: '1px solid #ff4444',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <div style={{ color: '#cc0000' }}>账户创建失败</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                {createStatus.reason}
              </div>
            </div>
          )}
        </div>
        <div className="drag-target">
          <div
            className={`nervos-galaxy ${isDropped ? "dropped" : ""}`}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <div className="galaxy-core">
              <Image src="/nervos-galaxy.png" alt="planet" width={240} height={160} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
