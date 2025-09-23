"use client";

import React, { useState } from "react";
// import { ccc } from "@ckb-ccc/connector-react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaCopy } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { Modal } from "./ui/modal";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  // const { open } = ccc.useCcc();
  const [currentStep, setCurrentStep] = useState(1);
  const [accountName, setAccountName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);

  const steps = [
    {
      id: 1,
      title: "连接钱包",
      status:
        currentStep > 1
          ? "completed"
          : currentStep === 1
          ? "current"
          : "pending",
    },
    {
      id: 2,
      title: "设置名称",
      status:
        currentStep > 2
          ? "completed"
          : currentStep === 2
          ? "current"
          : "pending",
    },
    {
      id: 3,
      title: "上链存储",
      status:
        currentStep > 3
          ? "completed"
          : currentStep === 3
          ? "current"
          : "pending",
    },
    {
      id: 4,
      title: "创建完成",
      status: currentStep === 4 ? "current" : "pending",
    },
  ];

  const handleConnectWallet = () => {
    // open();
    setCurrentStep(2);
  };

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

  const validateAccountName = (name: string) => {
    return /^[a-zA-Z0-9-]{4,18}$/.test(name);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropped(true);
    setIsDragging(false);
    // 模拟检查CKB余额
    setTimeout(() => {
      setShowInsufficientFunds(true);
    }, 1000);
    setTimeout(() => {
      setShowInsufficientFunds(false);
      setCurrentStep(4);

    }, 2000);
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
        <div className="login-progress">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`login-step ${step.status}`}>
                <div className="login-step-circle">{step.id}</div>
                <span className="login-step-title">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="login-step-separator">
                  <svg
                    width="8"
                    height="14"
                    viewBox="0 0 8 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 1L7 7L1 13" stroke="#4C525C" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 主要内容区域 - 根据步骤显示不同内容 */}
        {currentStep === 1 && (
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
              </div>
              <div className="login-graphic-section">
                <Image src="/login-bg.png" alt="login-graphic" width={224} height={160} />
              </div>
            </div>
            <div>
              {" "}
              <a href="#" className="login-info-link">
                什么是Web5?
                <IoMdInformationCircleOutline
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="web5的含义"
                />
              </a>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <div className="login-content-1">
            <div className="login-info-section">
              <h3 className="login-info-title">设置您的Web5 DID账号名称:</h3>
              <div className="name-input-container">
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="支持由数字、字母或特殊字符'-'组成的名称"
                  className="name-input"
                />
                {validateAccountName(accountName) && (
                  <div className="input-valid-icon">✓</div>
                )}
              </div>
              <div className="validation-message">
                <span className="validation-error">长度需为4-18个字符</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
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
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  
                      <Image
                        src="/nervos-planet.png"
                        alt="planet"
                        width={75}
                        height={40}
                      />
                  
                </div>
                <div className="account-info">
                  <div className="account-name">{accountName || "alice"}</div>
                  <div className="account-address">
                    ckt1qr...tt49 <FaCopy />
                  </div>
                </div>
                {showInsufficientFunds && (
              <div className="insufficient-funds-warning">
                需要至少355CKB才能上链存储信息, 请补充CKB或切换有充足CKB的钱包。
              </div>
            )}
              </div>
              <div className="drag-target">
                <div
                  className={`nervos-galaxy ${isDropped ? "dropped" : ""}`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="galaxy-core">
                    <Image src="/nervos-galaxy.png" alt="planet" width={240} height={160} />
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        )}

        {currentStep === 4 && (
            <div className="login-info-section">
              <h3 className="login-info-title">账号创建成功!</h3>
              <p className="success-description">
                  您的Web5
                  DID账号已成功创建并上链存储。现在您可以参与社区治理，发布提案和参与讨论了。
                </p>
              <div className="success-info">
                <div className="success-card">
                <div className="success-head">
                    <div className="card-img">
                    <Image src="/nervos-planet.png" alt="planet" width={60} height={32} />
                    </div>
                    <div className="card-name">{accountName || "alice"}</div>
                  </div>
                  <div className="success-details">
                    <div className="success-name">
                      {accountName || "alice"}.ckb.xyz
                    </div>
                    <div className="success-address">ckt1qr...tt49 <FaCopy /></div>
                  </div>
                </div>
               
              </div>
            </div>
        )}

        {/* 底部区域 */}
        <div className="login-footer">
          {currentStep === 1 && (
            <>
              <div className="step-navigation">
                <button
                  className="login-connect-button"
                  onClick={handleConnectWallet}
                >
                  连接钱包
                </button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div className="step-navigation">
              <button
                className="login-connect-button"
                onClick={handleNextStep}
                disabled={!validateAccountName(accountName)}
              >
                下一步
              </button>
            </div>
          )}

          {currentStep === 3 && <></>}

          {currentStep === 4 && (
            <div className="step-navigation">
              <Link href='#'
                onClick={handleComplete}
              >
                进入社区
              </Link>
            </div>
          )}
        </div>
    </Modal>
  );
}
