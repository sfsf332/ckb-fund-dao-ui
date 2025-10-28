"use client";

import React from "react";
import { useTranslation } from "@/utils/i18n";

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
  const { t } = useTranslation();
  
  return (
    <div className="login-content-1">
      <div className="login-info-section">
        <h3 className="login-info-title">{t("loginStep2.setAccountName")}</h3>
        <div className="name-input-container">
          <input
            type="text"
            value={accountName}
            onChange={(e) => {
              const value = e.target.value;
              setAccountName(value);
              debouncedValidateAccountName(value);
            }}
            placeholder={t("loginStep2.namePlaceholder")}
            className="name-input"
          />
        </div>
        <div className="validation-message">
          {isValidating && (
            <span className="validation-loading">{t("loginStep2.validating")}</span>
          )}
          {!isValidating && validationResult === false && validationError && (
            <span className="validation-error">{validationError}</span>
          )}
          {!isValidating && validationResult === true && (
            <span className="validation-success">{t("loginStep2.nameAvailable")}</span>
          )}
          {!isValidating && validationResult === null && accountName && (
            <span className="validation-error">{t("loginStep2.pleaseEnterName")}</span>
          )}
        </div>
      </div>
    </div>
  );
}
