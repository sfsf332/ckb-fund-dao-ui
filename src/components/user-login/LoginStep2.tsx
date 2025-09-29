"use client";

import React from "react";

interface LoginStep2Props {
  accountName: string;
  setAccountName: (name: string) => void;
  debouncedValidateAccountName: (name: string) => void;
  isValidating: boolean;
  validationResult: boolean | null;
  validationError: string | null;
}

export default function LoginStep2({
  accountName,
  setAccountName,
  debouncedValidateAccountName,
  isValidating,
  validationResult,
  validationError,
}: LoginStep2Props) {
  return (
    <div className="login-content-1">
      <div className="login-info-section">
        <h3 className="login-info-title">设置您的Web5 DID账号名称:</h3>
        <div className="name-input-container">
          <input
            type="text"
            value={accountName}
            onChange={(e) => {
              const value = e.target.value;
              setAccountName(value);
              debouncedValidateAccountName(value);
            }}
            placeholder="支持由数字、字母或特殊字符'-'组成的名称"
            className="name-input"
          />
        </div>
        <div className="validation-message">
          {isValidating && (
            <span className="validation-loading">正在验证...</span>
          )}
          {!isValidating && validationResult === false && validationError && (
            <span className="validation-error">{validationError}</span>
          )}
          {!isValidating && validationResult === true && (
            <span className="validation-success">✓ 账号名称可用</span>
          )}
          {!isValidating && validationResult === null && accountName && (
            <span className="validation-error">请输入账号名称</span>
          )}
        </div>
      </div>
    </div>
  );
}
