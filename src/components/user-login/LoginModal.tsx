"use client";

import React, { useState } from "react";
import { ccc } from "@ckb-ccc/connector-react";
import { Modal } from "../ui/modal";
import LoginProgress from "./LoginProgress";
import LoginStep1 from "./LoginStep1";
import LoginStep2 from "./LoginStep2";
import LoginStep3 from "./LoginStep3";
import LoginStep4 from "./LoginStep4";
import LoginFooter from "./LoginFooter";
import { useAccountNameValidation } from "@/hooks/useAccountNameValidation";
import { useCheckCkb } from "@/hooks/checkCkb";
import useCreateAccount from "@/hooks/createAccount";
import { USER_DOMAIN } from "@/constant/Network";
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { open, wallet, signerInfo, disconnect } = ccc.useCcc();
  const [currentStep, setCurrentStep] = useState(1);
  const [accountName, setAccountName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const {
    isValidating,
    validationResult,
    validationError,
    debouncedValidateAccountName,
  } = useAccountNameValidation();

  const { checkSimpleBalance, isLoading: balanceLoading, extraIsEnough, error: balanceError } = useCheckCkb();
  const { createAccount, loading: createLoading, createStatus, resetCreateStatus } = useCreateAccount({
    createSuccess: () => {
    
      
      // 注册成功后自动切换到step4
      setCurrentStep(4);
    },
  });


  // 检查是否已连接钱包
  const isConnected = Boolean(wallet) && Boolean(signerInfo);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      await open();
      // 钱包连接成功后不自动进入下一步，保持在第一步
    } catch (error) {
      console.error("连接钱包失败:", error);
      setIsConnecting(false);
    }
  };

  // 断开钱包连接
  const handleDisconnectWallet = async () => {
    try {
      // 调用 ccc 库的断开连接方法
      await disconnect();
      // 重置所有状态
      setCurrentStep(1);
      setAccountName("");
      setIsDropped(false);
      setShowInsufficientFunds(false);
      setIsConnecting(false);
    } catch (error) {
      console.error("断开钱包连接失败:", error);
    }
  };

 

  // 监听钱包连接状态 - 不再自动跳转到下一步
  React.useEffect(() => {
    if (isConnected && signerInfo) {
      setIsConnecting(false);
      // 保持在第一步，让用户手动选择是否继续
    }
  }, [isConnected, signerInfo]);

  // 进入步骤3时重置状态
  React.useEffect(() => {
    if (currentStep === 3) {
      setIsDropped(false);
      setShowInsufficientFunds(false);
      setIsDragging(false);
      resetCreateStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  // 返回到步骤1
  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setAccountName("");
  };

  // 返回到步骤2
  const handleBackToStep2 = () => {
    setCurrentStep(2);
    setIsDropped(false);
    setShowInsufficientFunds(false);
  };



  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropped(true);
    setIsDragging(false);
    
    // 真实检查CKB余额
    if (signerInfo) {
      try {
        // 检查简单余额（需要355 CKB）
        const balanceResult = await checkSimpleBalance(signerInfo, BigInt(355 * 10**8));
        
        if (balanceResult.isEnough) {
          // 余额充足，开始创建账户
          setShowInsufficientFunds(false);
          console.log("余额检查通过，开始创建账户...");
          
          // 直接调用创建账户方法，它会自动处理余额验证和私钥生成
          if (signerInfo?.signer && wallet) {
            // 从signer中获取钱包地址
            const addresses = await signerInfo.signer.getAddresses();
            const walletAddress = addresses[0];
            
            await createAccount(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              signerInfo.signer as any, // 类型转换
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              wallet as any, // 类型转换
              `${accountName}.${USER_DOMAIN}`,
              walletAddress, // 使用从signer获取的地址
            );
          }
        } else {
          // 余额不足，显示警告
          setShowInsufficientFunds(true);
          console.log("CKB余额不足:", balanceResult.error);
        }
      } catch (error) {
        console.error("检查CKB余额时发生错误:", error);
        setShowInsufficientFunds(true);
      }
    } else {
      console.error("未找到签名器信息");
      setShowInsufficientFunds(true);
    }
  };

  // 重新检查余额
  const handleRecheckBalance = async () => {
    if (signerInfo) {
      try {
        const balanceResult = await checkSimpleBalance(signerInfo, BigInt(355 * 10**8));
        console.log("balanceResult", balanceResult);
        if (balanceResult.isEnough) {
          setShowInsufficientFunds(false);
          console.log("重新检查余额通过，开始创建账户...");
          
          // 调用创建账户方法
          if (signerInfo?.signer && wallet) {
            // 从signer中获取钱包地址
            const addresses = await signerInfo.signer.getAddresses();
            const walletAddress = addresses[0];
            
            await createAccount(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              signerInfo.signer as any, // 类型转换
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              wallet as any, // 类型转换
              `${accountName}.${USER_DOMAIN}`,
              walletAddress, // 使用从signer获取的地址
            );
          }
        } else {
          setShowInsufficientFunds(true);
          console.log("CKB余额仍然不足:", balanceResult.error);
        }
      } catch (error) {
        console.error("重新检查CKB余额时发生错误:", error);
        setShowInsufficientFunds(true);
      }
    }
  };

  const handleComplete = () => {
    onClose();
    setCurrentStep(1);
    setAccountName("");
    setIsDropped(false);
    setShowInsufficientFunds(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="创建账号"
      size="large"
      className="login-modal"
      showCloseButton={true}
    >

        {/* 进度指示器 */}
        <LoginProgress currentStep={currentStep} />

        {/* 主要内容区域 - 根据步骤显示不同内容 */}
        {currentStep === 1 && (
          <LoginStep1 
            onDisconnect={handleDisconnectWallet}
           
          />
        )}

        {currentStep === 2 && (
          <LoginStep2
            accountName={accountName}
            setAccountName={setAccountName}
            debouncedValidateAccountName={debouncedValidateAccountName}
            isValidating={isValidating}
            validationResult={validationResult}
            validationError={validationError}
          />
        )}

        {currentStep === 3 && (
          <LoginStep3
            accountName={accountName}
            isDragging={isDragging}
            isDropped={isDropped}
            showInsufficientFunds={showInsufficientFunds}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onRecheckBalance={handleRecheckBalance}
            createLoading={createLoading}
            createStatus={createStatus}
            // 添加余额检查相关状态
            balanceLoading={balanceLoading}
            extraIsEnough={extraIsEnough}
            balanceError={balanceError}
          />
        )}

        {currentStep === 4 && <LoginStep4 accountName={accountName} />}

        {/* 底部区域 */}
        <LoginFooter
          currentStep={currentStep}
          validationResult={validationResult}
          isValidating={isValidating}
          onConnectWallet={handleConnectWallet}
          onNextStep={handleNextStep}
          onComplete={handleComplete}
          onBackToStep1={handleBackToStep1}
          onBackToStep2={handleBackToStep2}
          isConnecting={isConnecting}
          isConnected={isConnected}
          createStatus={createStatus}
        />
    </Modal>
  );
}
