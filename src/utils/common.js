import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";

/**
 * 通用的复制到剪贴板方法
 * @param {string} text - 要复制的文本
 * @param {string} successMessage - 成功提示信息，默认为"已复制到剪贴板"
 */
export const handleCopy = (text, successMessage = "已复制到剪贴板") => {
  try {
    copy(text);
    toast.success(successMessage);
  } catch (error) {
    console.error("复制失败:", error);
    toast.error("复制失败，请重试");
  }
};

/**
 * 复制地址到剪贴板（专门用于地址复制）
 * @param {string} address - 要复制的地址
 */
export const copyAddress = (address) => {
  handleCopy(address, "地址已复制到剪贴板");
};

/**
 * 复制文本到剪贴板（通用文本复制）
 * @param {string} text - 要复制的文本
 */
export const copyText = (text) => {
  handleCopy(text, "文本已复制到剪贴板");
};
