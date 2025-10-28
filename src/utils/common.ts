import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";

/**
 * 通用的复制到剪贴板方法
 * @param {string} text - 要复制的文本
 * @param {string} successMessage - 成功提示信息
 */
export const handleCopy = (text: string, successMessage: string) => {
  try {
    copy(text);
    toast.success(successMessage);
  } catch (error) {
    console.error("Copy failed:", error);
    toast.error("Copy failed, please try again");
  }
};

/**
 * 复制地址到剪贴板（专门用于地址复制）
 * @param {string} address - 要复制的地址
 * @param {string} successMessage - 成功提示信息
 */
export const copyAddress = (address: string, successMessage: string) => {
  handleCopy(address, successMessage);
};

/**
 * 复制文本到剪贴板（通用文本复制）
 * @param {string} text - 要复制的文本
 * @param {string} successMessage - 成功提示信息
 */
export const copyText = (text: string, successMessage: string) => {
  handleCopy(text, successMessage);
};
