"use client";

import React from "react";

interface Step {
  id: number;
  title: string;
  status: "completed" | "current" | "pending";
}

interface LoginProgressProps {
  currentStep: number;
}

export default function LoginProgress({ currentStep }: LoginProgressProps) {
  const steps: Step[] = [
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

  return (
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
  );
}
