"use client";

import React from "react";
import Link from "next/link";
import { CreateAccountStatus, CREATE_STATUS } from "@/hooks/createAccount";

interface LoginFooterProps {
  currentStep: number;
  validationResult: boolean | null;
  isValidating: boolean;
  onConnectWallet: () => void;
  onNextStep: () => void;
  onComplete: () => void;
  onBackToStep1?: () => void;
  onBackToStep2?: () => void;
  isConnecting?: boolean;
  isConnected?: boolean;
  createStatus?: CreateAccountStatus;
}

export default function LoginFooter({
  currentStep,
  validationResult,
  isValidating,
  onConnectWallet,
  onNextStep,
  onComplete,
  onBackToStep1,
  onBackToStep2,
  isConnecting = false,
  isConnected = false,
  createStatus,
}: LoginFooterProps) {
  return (
    <div className="login-footer">
      {currentStep === 1 && (
        <div className="step-navigation">
          {!isConnected ? (
            <button
              className="login-connect-button"
              onClick={onConnectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? "连接中..." : "连接钱包"}
            </button>
          ) : (
            <button
              className="login-connect-button"
              onClick={onNextStep}
            >
              下一步
            </button>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <div className="step-navigation" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {onBackToStep1 && (
            <button
              className="login-connect-button"
              onClick={onBackToStep1}
              style={{ backgroundColor: '#6A727B' }}
            >
              返回上一步
            </button>
          )}
          <button
            className="login-connect-button"
            onClick={onNextStep}
            disabled={!validationResult || isValidating}
          >
            下一步
          </button>
        </div>
      )}

      {currentStep === 3 && (
        <div className="step-navigation">
          {createStatus?.status === CREATE_STATUS.FAILURE && onBackToStep2 && (
            <button
              className="login-connect-button"
              onClick={onBackToStep2}
            >
              返回上一步
            </button>
          )}
        </div>
      )}

      {currentStep === 4 && (
        <div className="step-navigation">
          <Link href="#" onClick={onComplete}>
            进入社区
          </Link>
        </div>
      )}
    </div>
  );
}
