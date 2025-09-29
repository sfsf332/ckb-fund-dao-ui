"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import getPDSClient from "@/lib/pdsClient";
import { USER_DOMAIN } from "@/constant/Network";
import { Secp256k1Keypair } from "@atproto/crypto";

interface ValidationResult {
  valid: boolean;
  error: string | null;
}

export function useAccountNameValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const validateAccountName = useCallback(async (name: string): Promise<ValidationResult> => {
    // 只允许字母、数字、连字符
    if (!/^[a-zA-Z0-9-]+$/.test(name)) {
      return { valid: false, error: "仅支持输入字母、数字和连字符（-）" };
    }
    // 不允许下划线
    if (name.includes("_")) {
      return { valid: false, error: "不支持下划线（_）" };
    }
    // 不能以连字符开头或结尾
    if (name.startsWith("-") || name.endsWith("-")) {
      return { valid: false, error: "不能以连字符（-）开头或结尾" };
    }
    // 长度校验
    if (name.length < 4 || name.length > 18) {
      return { valid: false, error: "长度需为4~18个字符" };
    }
    
    try {
      const keyPair = await Secp256k1Keypair.create();
      const signingKey = keyPair.did();

      const res = await getPDSClient().com.atproto.web5.preCreateAccount({
        handle: name + `.${USER_DOMAIN}`,
        signingKey,
        did: 'did:plc:n5d3aggygtfxs56gbjkcajxw',
      });
      console.log(res, 'res');
      return { valid: true, error: null };
    } catch (error) {
      console.error('Validation error:', error);
      return { valid: false, error: "账号名称不可用" };
    }
  }, []);

  const debouncedValidateAccountName = useCallback((name: string) => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set validation state
    setIsValidating(true);
    setValidationResult(null);
    setValidationError(null);

    // Set new timer
    debounceTimer.current = setTimeout(async () => {
      const result = await validateAccountName(name);
      setValidationResult(result.valid);
      setValidationError(result.error);
      setIsValidating(false);
    }, 500); // 500ms debounce delay
  }, [validateAccountName]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    isValidating,
    validationResult,
    validationError,
    debouncedValidateAccountName,
  };
}
