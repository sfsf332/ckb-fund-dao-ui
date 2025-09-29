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
  const { open, wallet, signerInfo } = ccc.useCcc();
  // 修复：移除未定义的 singer 变量的日志
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
  const { createAccount, loading: createLoading, createStatus } = useCreateAccount({
    createSuccess: () => {
      console.log('账户创建成功！');
      // 可以在这里添加成功后的处理逻辑
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
      console.error("钱包连接失败:", error);
      setIsConnecting(false);
    }
  };

  // 断开钱包连接
  const handleDisconnectWallet = async () => {
    try {
      // 这里需要调用断开连接的方法
      // 由于ccc库可能没有直接的断开方法，我们重置状态
      setCurrentStep(1);
      setAccountName("");
      setIsDropped(false);
      setShowInsufficientFunds(false);
      setIsConnecting(false);
      // 可以在这里添加其他重置逻辑
    } catch (error) {
      console.error("断开钱包连接失败:", error);
    }
  };

  // 切换钱包地址
  const handleSwitchWallet = async () => {
    try {
      setIsConnecting(true);
      await open();
      // 切换钱包后保持在第一步
    } catch (error) {
      console.error("切换钱包失败:", error);
      setIsConnecting(false);
    }
  };

  // 监听钱包连接状态 - 不再自动跳转到下一步
  React.useEffect(() => {
    if (isConnected && signerInfo) {
      setIsConnecting(false);
      // 保持在第一步，让用户手动选择是否继续
    }
  }, [isConnected, signerInfo]);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  // const handlePrevStep = () => {
  //   if (currentStep > 1) {
  //     setCurrentStep(currentStep - 1);
  //   }
  // };


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
            onSwitchWallet={handleSwitchWallet}
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
          isConnecting={isConnecting}
          isConnected={isConnected}
        />
    </Modal>
  );
}
