"use client";

import React from "react";
import { useTranslation } from "@/utils/i18n";

interface Step {
  id: number;
  title: string;
  status: "completed" | "current" | "pending";
}


interface LoginProgressProps {
  currentStep: number;
  isSuccess?: boolean; // 添加成功状态
}

export default function LoginProgress({ currentStep, isSuccess = false }: LoginProgressProps) {
  const { t } = useTranslation();
  // 步骤映射：内部步骤 1,2,3 对应显示步骤 1,2,3
  // 内部步骤1 = 连接钱包（不显示在进度条）
  // 内部步骤2 = 设置名称（进度条第1步）
  // 内部步骤3 = 上链存储（进度条第2步）
  // 完成状态 = 创建完成（进度条第3步）
  
  // 计算进度条显示步骤
  // 如果创建成功，显示第3步为完成
  const progressStep = isSuccess ? 3 : (currentStep === 1 ? 1 : currentStep - 1);
  
  const steps: Step[] = [
    {
      id: 1,
      title: t("loginProgress.setName"),
      status:
        progressStep > 1
          ? "completed"
          : progressStep === 1
          ? "current"
          : "pending",
    },
    {
      id: 2,
      title: t("loginProgress.onChainStorage"),
      status:
        progressStep > 2
          ? "completed"
          : progressStep === 2
          ? "current"
          : "pending",
    },
      {
        id: 3,
        title: t("loginProgress.creationComplete"),
        status: 
          progressStep > 3
            ? "completed"
            : progressStep === 3
            ? (isSuccess ? "completed" : "current")
            : "pending",
      },
  ];

  return (
    <div className="login-progress">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className={`login-step ${step.status}`}>
            {step.status === "completed" ? (
              <div className="login-step-circle completed">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3L4.5 8.5L2 6" stroke="#00CC9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ) : (
              <div className="login-step-circle">{step.id}</div>
            )}
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
  );
}
