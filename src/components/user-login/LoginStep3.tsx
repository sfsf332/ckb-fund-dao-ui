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
  
  // 如果创建成功，显示成功信息
  if (createStatus?.status === CREATE_STATUS.SUCCESS) {
    return (
      <div className="login-info-section">
        <h3 className="login-info-title">{t("loginStep4.accountCreatedSuccess")}</h3>
        <p className="success-description">
          {t("loginStep4.successDescription")}
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
                {isLoadingAddress ? t("loginStep4.gettingAddress") : formatAddress(walletAddress)} 
                <CopyButton text={walletAddress} className="copy-button" ariaLabel="copy-wallet-address" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="login-info-section">
      <h3 className="login-info-title">
        {t("loginStep3.dragTitle")}
      </h3>
      <p className="login-description">
        {t("loginStep3.description")}
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
              {isLoadingAddress ? t("loginStep3.gettingAddress") : formatAddress(walletAddress)} 
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
                {t("loginStep3.insufficientBalance")}
              </div>
              <div>
                {t("loginStep3.requiredCapacity")}
              </div>
              {balanceLoading && (
                <div style={{ marginTop: '4px', fontStyle: 'italic' }}>
                  {t("loginStep3.checkingBalance")}
                </div>
              )}
              {balanceError && (
                <div style={{ marginTop: '4px', color: '#dc3545' }}>
                  {t("loginStep3.error")} {balanceError}
                </div>
              )}
            </div>
          )}
          {showInsufficientFunds && (
            <div className="insufficient-funds-warning">
              {t("loginStep3.insufficientFundsWarning")}
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
                  {t("loginStep3.recheckBalance")}
                </button>
              )}
            </div>
          )}

          {/* 创建账户状态显示 */}
          {createLoading && (
            <div className="create-account-loading">
              <div>{t("loginStep3.creatingAccount")}</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                {t("loginStep3.pleaseWait")}
              </div>
            </div>
          )}

          {createStatus?.status === CREATE_STATUS.FAILURE && (
            <div className="create-account-error">
              <div>{t("loginStep3.accountCreationFailed")}</div>
              <div className="error-reason">
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
