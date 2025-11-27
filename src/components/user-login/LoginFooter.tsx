"use client";

import React from "react";
import Link from "next/link";
import { CreateAccountStatus, CREATE_STATUS } from "@/hooks/createAccount";
import { useTranslation } from "@/utils/i18n";
import ImportDidModal from "./ImportDidModal";
import ScanQRCodeModal from "./ScanQRCodeModal";

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
  const { t } = useTranslation();
  const [showWeb5DidDropdown, setShowWeb5DidDropdown] = React.useState(false);
  const [showImportDidModal, setShowImportDidModal] = React.useState(false);
  const [showScanQRCodeModal, setShowScanQRCodeModal] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowWeb5DidDropdown(false);
      }
    };

    if (showWeb5DidDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showWeb5DidDropdown]);

  return (
    <div className="login-footer">
      {currentStep === 1 && (
        <div className="step-navigation">
          {!isConnected ? (
            <>
              <button
                className="login-connect-button"
                onClick={onConnectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? t("loginFooter.connecting") : t("loginStep1.connectWalletCreate")}
              </button>
              <div className="web5-did-dropdown-container" ref={dropdownRef}>
                <button
                  className={`login-web5-did-button ${showWeb5DidDropdown ? "active" : ""}`}
                  onClick={() => setShowWeb5DidDropdown(!showWeb5DidDropdown)}
                >
                  {t("loginStep1.existingWeb5Did")}
                 
                </button>
                {showWeb5DidDropdown && (
                  <div className="web5-did-dropdown">
                    <div
                      className="web5-did-dropdown-item"
                      onClick={() => {
                        setShowWeb5DidDropdown(false);
                        setShowImportDidModal(true);
                      }}
                    >
                      {t("loginStep1.importKeyLogin")}
                    </div>
                    <div
                      className="web5-did-dropdown-item"
                      onClick={() => {
                        setShowWeb5DidDropdown(false);
                        setShowScanQRCodeModal(true);
                      }}
                    >
                      {t("loginStep1.scanQrCodeLogin")}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              className="login-connect-button"
              onClick={onNextStep}
            >
              {t("loginFooter.nextStep")}
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
              {t("loginFooter.backToPreviousStep")}
            </button>
          )}
          <button
            className="login-connect-button"
            onClick={onNextStep}
            disabled={!validationResult || isValidating}
          >
            {t("loginFooter.nextStep")}
          </button>
        </div>
      )}

      {currentStep === 3 && (
        <div className="step-navigation" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {createStatus?.status === CREATE_STATUS.SUCCESS ? (
            <button
              className="login-connect-button"
              onClick={onNextStep}
            >
              {t("loginFooter.nextStep")}
            </button>
          ) : (
            <>
              {onBackToStep2 && (
                <button
                  className="login-connect-button"
                  onClick={onBackToStep2}
                  style={{ backgroundColor: '#6A727B' }}
                >
                  {t("loginFooter.backToPreviousStep")}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {currentStep === 4 && (
        <div className="step-navigation" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="#" onClick={onComplete}>
            {t("loginFooter.enterCommunity")}
          </Link>
        </div>
      )}

      {/* 导入DID弹窗 */}
      <ImportDidModal
        isOpen={showImportDidModal}
        onClose={() => setShowImportDidModal(false)}
        onSuccess={() => {
          setShowImportDidModal(false);
          // 导入成功后可以触发登录成功回调
        }}
      />
      {/* 扫描二维码弹窗 */}
      <ScanQRCodeModal
        isOpen={showScanQRCodeModal}
        onClose={() => setShowScanQRCodeModal(false)}
        onSuccess={() => {
          setShowScanQRCodeModal(false);
          // 扫描成功后可以触发登录成功回调
        }}
      />
    </div>
  );
}
