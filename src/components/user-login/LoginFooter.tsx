"use client";

import React from "react";
import Link from "next/link";

interface LoginFooterProps {
  currentStep: number;
  validationResult: boolean | null;
  isValidating: boolean;
  onConnectWallet: () => void;
  onNextStep: () => void;
  onComplete: () => void;
  isConnecting?: boolean;
  isConnected?: boolean;
}

export default function LoginFooter({
  currentStep,
  validationResult,
  isValidating,
  onConnectWallet,
  onNextStep,
  onComplete,
  isConnecting = false,
  isConnected = false,
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
        <div className="step-navigation">
          <button
            className="login-connect-button"
            onClick={onNextStep}
            disabled={!validationResult || isValidating}
          >
            下一步
          </button>
        </div>
      )}

      {currentStep === 3 && <></>}

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
