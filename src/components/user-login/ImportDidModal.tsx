"use client";

import React, { useState, useRef } from "react";
import Modal from "@/components/ui/modal/Modal";
import { useTranslation } from "@/utils/i18n";
import useUserInfoStore from "@/store/userInfo";
import { TokenStorageType } from "@/lib/storage";
import { MdCloudUpload, MdCheckCircle } from "react-icons/md";
import { decryptData } from "@/lib/encrypt";
import { Html5Qrcode } from "html5-qrcode";
import "./ImportDidModal.css";

enum ImportStep {
  UPLOAD = "upload",
  SELECT_FILE = "select_file",
  ENTER_PASSWORD = "enter_password",
  VERIFYING = "verifying",
  SUCCESS = "success",
}

interface ImportDidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ImportDidModal({
  isOpen,
  onClose,
  onSuccess,
}: ImportDidModalProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<ImportStep>(ImportStep.UPLOAD);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importUserDid = useUserInfoStore((state) => state.importUserDid);

  // 重置状态
  const resetState = () => {
    setCurrentStep(ImportStep.UPLOAD);
    setSelectedFile(null);
    setFileContent("");
    setPassword("");
    setError("");
    setIsVerifying(false);
    setShowSuccessModal(false);
  };

  // 关闭弹窗
  const handleClose = () => {
    resetState();
    onClose();
  };

  // 处理文件选择
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError("");

    // 检查文件类型
    const isImage = file.type.startsWith("image/");
    const isText = file.type === "text/plain" || file.name.endsWith(".txt");

    if (!isImage && !isText) {
      setError(t("importDid.invalidFileType"));
      return;
    }

    try {
      if (isText) {
        // 读取txt文件内容
        const text = await file.text();
        setFileContent(text.trim());
        setCurrentStep(ImportStep.ENTER_PASSWORD);
      } else if (isImage) {
        // 对于图片文件，扫描二维码
        setIsVerifying(true);
        setError("");

        try {
          // 使用临时容器进行文件扫描
          const tempContainerId = 'temp-qr-scanner-import';
          let tempContainer = document.getElementById(tempContainerId);
          if (!tempContainer) {
            tempContainer = document.createElement('div');
            tempContainer.id = tempContainerId;
            tempContainer.style.display = 'none';
            document.body.appendChild(tempContainer);
          }

          const html5QrCode = new Html5Qrcode(tempContainerId);
          const decodedText = await html5QrCode.scanFile(file, false);
          
          // 清理临时容器
          html5QrCode.clear();
          if (tempContainer && tempContainer.parentNode) {
            tempContainer.parentNode.removeChild(tempContainer);
          }
          
          // 设置扫描到的二维码数据
          setFileContent(decodedText.trim());
          setCurrentStep(ImportStep.ENTER_PASSWORD);
        } catch (scanErr: unknown) {
          console.error('扫描二维码失败:', scanErr);
          setError(t("importDid.qrCodeScanFailed") || "无法识别二维码，请确保图片清晰且包含有效的二维码");
        } finally {
          setIsVerifying(false);
        }
      }
    } catch (err) {
      setError(t("importDid.fileReadError"));
      console.error("读取文件失败:", err);
      setIsVerifying(false);
    }
  };

  // 处理密码输入
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 限制为8位数字或字母
    const filtered = value.replace(/[^A-Za-z0-9]/g, '').slice(0, 8);
    setPassword(filtered);
    setError("");
  };

  // 验证并导入
  const handleVerify = async () => {
    const passwordRegex = /^[A-Za-z0-9]{8}$/;
    if (!passwordRegex.test(password)) {
      setError(t("importDid.passwordLengthError") || "密码必须为8位数字或字母");
      return;
    }

    if (!fileContent) {
      setError(t("importDid.noFileContent"));
      return;
    }

    setIsVerifying(true);
    setError("");
    setCurrentStep(ImportStep.VERIFYING);

    try {
      // 解析DID数据
      // 这里需要根据实际的数据格式来解析
      // 假设fileContent是加密的字符串，需要根据密码解密
      const decryptedData = await decryptDidData(fileContent, password);
      
      // 验证数据格式
      if (!decryptedData.did || !decryptedData.signKey || !decryptedData.walletAddress) {
        throw new Error(t("importDid.invalidDataFormat"));
      }

      // 导入用户DID
      const tokenData: TokenStorageType = {
        did: decryptedData.did,
        signKey: decryptedData.signKey,
        walletAddress: decryptedData.walletAddress,
      };

      await importUserDid(tokenData);
      
      // 显示成功弹窗
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const errorMessage = (err && typeof err === "object" && "message" in err) ? (err as { message?: string }).message : undefined;
      setError(errorMessage || t("importDid.verificationFailed"));
      setCurrentStep(ImportStep.ENTER_PASSWORD);
    } finally {
      setIsVerifying(false);
    }
  };

  // 解密DID数据
  const decryptDidData = async (
    encryptedData: string,
    password: string
  ): Promise<TokenStorageType> => {
    try {
      let dataToParse = encryptedData.trim();

      // 处理 @dao-client: 前缀（storage格式）
      if (dataToParse.startsWith("@dao-client:")) {
        dataToParse = dataToParse.replace("@dao-client:", "").trim();
      }

      // 尝试解析为JSON（如果已经是解密后的数据）
      if (dataToParse.startsWith("{")) {
        try {
          const parsed = JSON.parse(dataToParse);
          if (parsed.did && parsed.signKey && parsed.walletAddress) {
            return parsed;
          }
        } catch {
          // 不是有效的JSON，继续尝试解密
        }
      }

      // 尝试使用密码解密（AES-GCM）
      if (password && password.length >= 8) {
        try {
          const decrypted = await decryptData(dataToParse, password);
          if (decrypted) {
            const parsed = JSON.parse(decrypted);
            if (parsed.did && parsed.signKey && parsed.walletAddress) {
              return parsed;
            }
          }
        } catch (err) {
          console.error('AES解密失败:', err);
          // 继续尝试其他方式
        }
      }

      // 尝试base64解码（兼容旧格式）
      try {
        const decoded = atob(dataToParse);
        const parsed = JSON.parse(decoded);
        if (parsed.did && parsed.signKey && parsed.walletAddress) {
          return parsed;
        }
      } catch {
        // 不是base64编码，继续尝试其他方式
      }

      // 如果所有方式都失败，抛出错误
      throw new Error(t("importDid.decryptionFailed"));
    } catch (err: unknown) {
      const errorMessage = (err && typeof err === "object" && "message" in err) ? (err as { message?: string }).message : undefined;
      if (errorMessage === t("importDid.decryptionFailed")) {
        throw err;
      }
      console.error('解密过程出错:', err);
      throw new Error(t("importDid.decryptionFailed"));
    }
  };

  // 处理成功弹窗确认
  const handleSuccessConfirm = () => {
    resetState();
    onClose();
    onSuccess?.();
    // 刷新页面
    window.location.reload();
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showSuccessModal}
        onClose={handleClose}
        title={t("importDid.title")}
        size="medium"
        showCloseButton={true}
        className="import-did-modal"
      >
      <div className="import-did-content">
        {/* 步骤1: 上传文件 */}
        {currentStep === ImportStep.UPLOAD && (
          <div className="import-did-step">
            <p className="import-did-select-label">
              {t("importDid.selectKeyInfo")}
            </p>
            <div 
              className="import-did-upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.txt"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
              <div className="import-did-icon-large">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8C13.7909 8 12 9.79086 12 12V52C12 54.2091 13.7909 56 16 56H48C50.2091 56 52 54.2091 52 52V20L40 8H16Z" fill="#00CC9B" fillOpacity="0.2"/>
                  <path d="M40 8V20H52" stroke="#00CC9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M32 32V44M24 36H40" stroke="#00CC9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="import-did-instruction">
                {t("importDid.clickToSelect")}
              </p>
              <p className="import-did-hint">
                {t("importDid.supportedFormats")}
              </p>
            </div>
          </div>
        )}

        {/* 步骤2: 输入密码 */}
        {currentStep === ImportStep.ENTER_PASSWORD && (
          <div className="import-did-step">
            <div className="import-did-password-section">
              <p className="import-did-instruction">
                {t("importDid.enterPassword")}
              </p>
              <div className="import-did-password-input-container">
                <input
                  type="password"
                  className="import-did-password-input"
                  placeholder={t("importDid.passwordPlaceholder")}
                  value={password}
                  onChange={handlePasswordChange}
                  maxLength={8}
                  disabled={isVerifying}
                />
              </div>
              {error && <div className="import-did-error">{error}</div>}
              <div className="import-did-buttons">
                <button
                  className="import-did-button import-did-button-primary"
                  onClick={handleVerify}
                  disabled={password.length !== 8 || isVerifying}
                >
                  {t("importDid.confirm")}
                </button>
                <button
                  className="import-did-button import-did-button-secondary"
                  onClick={() => {
                    resetState();
                    setCurrentStep(ImportStep.UPLOAD);
                  }}
                  disabled={isVerifying}
                >
                  {t("importDid.cancel")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 步骤3: 验证中 */}
        {currentStep === ImportStep.VERIFYING && (
          <div className="import-did-step">
            <div className="import-did-verifying">
              <div className="import-did-icon-large">
                <MdCloudUpload />
              </div>
              <p className="import-did-verifying-text">
                {t("importDid.verifying")}
              </p>
            </div>
          </div>
        )}

      </div>
      </Modal>
      
      {/* 成功提示弹窗 */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessConfirm}
        size="small"
        showCloseButton={false}
        buttons={[
          {
            text: t("importDid.successConfirm") || "确认",
            onClick: handleSuccessConfirm,
            variant: 'primary' as const,
          },
        ]}
        className="import-did-success-modal"
      >
        <div className="import-did-success-content">
          <div className="import-did-success-icon">
            <MdCheckCircle />
          </div>
          <p className="import-did-success-title">
            {t("importDid.verificationSuccess")}
          </p>
          <p className="import-did-success-message">
            {t("importDid.loginComplete")}
          </p>
        </div>
      </Modal>
    </>
  );
}

