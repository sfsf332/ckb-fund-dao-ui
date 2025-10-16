"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { MdClose } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { SignatureModal, SuccessModal } from "../ui/modal";
import { useWalletAddress } from "../../hooks/useWalletAddress";
import { useWalletBalance } from "../../hooks/useWalletBalance";
import { BindInfo, BindInfoWithSig } from "../../utils/molecules";
import { ccc, hexFrom } from "@ckb-ccc/core";
import { useWallet } from "@/provider/WalletProvider";

interface WalletDaoCardProps {
  className?: string;
}

export default function WalletDaoCard({ className = "" }: WalletDaoCardProps) {
  const [votingPower] = useState("4,000,000");
  const { walletAddress, isLoadingAddress, isConnected } = useWalletAddress();
  const { walletBalance, isLoadingBalance, formatBalance } = useWalletBalance();
  const { signer } = useWallet();

  // 自定义地址格式化函数：前7个字符...后4个字符
  const formatWalletAddress = (address: string) => {
    if (!address) return "获取地址中...";
    if (address.length <= 11) return address;
    return `${address.slice(0, 7)}...${address.slice(-4)}`;
  };

  const [showNeuronDropdown, setShowNeuronDropdown] = useState(false);
  const [neuronWallets, setNeuronWallets] = useState([
    "ckb1qyq...gjw",
    "ckb1ikm...2x8",
    "ckb1klp...ti9",
  ]);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const generateBindInfo = useCallback(async () => {
    const timestamp = Date.now();
    const cccClient = new ccc.ClientPublicTestnet();
    const toAddr =
      (await ccc.Address.fromString(walletAddress, cccClient)) || "";
    const bindInfoLike = {
      to: toAddr.script,
      timestamp: BigInt(timestamp),
    };
    const bindInfo = BindInfo.from(bindInfoLike);

    const bindInfoBytes = bindInfo.toBytes();
    const bindInfoHex = ccc.hexFrom(bindInfoBytes);
    console.log("bind info: ", bindInfoHex);

    return { bindInfo, bindInfoHex };
  }, [walletAddress]);

  const [signatureMessage, setSignatureMessage] = useState<string>("");
  const [bindInfo, setBindInfo] = useState<BindInfo | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 将 base64 签名转换为十六进制
  const base64ToHex = (base64: string): string => {
    try {
      // 移除可能的填充字符
      const cleanBase64 = base64.replace(/[^A-Za-z0-9+/]/g, '');
      // 解码 base64 为字节数组
      const bytes = atob(cleanBase64);
      // 转换为十六进制
      return Array.from(bytes)
        .map(byte => byte.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
    } catch (error) {
      console.error('Base64 转换失败:', error);
      return '';
    }
  };

  // 生成签名消息和绑定信息
  useEffect(() => {
    if (walletAddress && isConnected) {
      generateBindInfo().then(({ bindInfo, bindInfoHex }) => {
        setSignatureMessage(bindInfoHex);
        setBindInfo(bindInfo);
      });
    }
  }, [walletAddress, isConnected, generateBindInfo]);

  const handleStakeCKB = () => {
    // 处理质押CKB逻辑
    console.log("质押CKB");
  };

  const handleBindNeuron = () => {
    setShowNeuronDropdown(!showNeuronDropdown);
  };

  const handleBindNewWallet = () => {
    setShowNeuronDropdown(false);
    setShowSignatureModal(true);
  };

  const handleSignatureBind = async(signature: string) => {
    if (!signer) {
      console.error("签名器未连接");
      return;
    }

    if (!bindInfo) {
      console.error("绑定信息未生成");
      return;
    }

    const tx = ccc.Transaction.default();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    await tx.completeInputsAtLeastOne(signer as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await tx.completeFeeBy(signer as any);

    // 将 base64 签名转换为十六进制
    const signatureHex = base64ToHex(signature);
    if (!signatureHex) {
      console.error("签名转换失败");
      return;
    }

    const bindInfoWithSig = BindInfoWithSig.from({
      bind_info: bindInfo,
      sig: hexFrom(`0x${signatureHex}`)
    })
  
    const bindInfoWithSigBytes = bindInfoWithSig.toBytes();
  
    const bindInfoWithSigHex = ccc.hexFrom(bindInfoWithSigBytes);
  
    console.log("bind info with sig: ", bindInfoWithSigHex);
    // 修正: 确保 WitnessArgs 已正确定义且 imported，并使用 const
    const witnessArgs = ccc.WitnessArgs.from({
      inputType: bindInfoWithSigBytes,
    });
    tx.setWitnessArgsAt(0, witnessArgs);

    await signer.signTransaction(tx);

    console.log("tx: ", ccc.stringify(tx));

    setShowSignatureModal(false);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // 这里可以添加新钱包地址到列表
    const newWallet = `ckb1new...${Math.random().toString(36).substr(2, 4)}`;
    setNeuronWallets((prev) => [...prev, newWallet]);
  };

  const handleRemoveWallet = (walletToRemove: string) => {
    setNeuronWallets((prev) =>
      prev.filter((wallet) => wallet !== walletToRemove)
    );
  };

  // 点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNeuronDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`wallet-dao-card ${className}`}>
      <h3 className="card-title">钱包及 Nervos DAO</h3>

      <div className="voting-power-section">
        <div className="voting-power-header">
          <h4 className="voting-power-label">
            我的投票权
            <IoMdInformationCircleOutline
              data-tooltip-id="my-tooltip"
              data-tooltip-content="投票权的解释"
            />
          </h4>
        </div>
        <div className="voting-power-amount">{votingPower} CKB</div>
      </div>

      <div className="wallet-section">
        <div className="wallet-address-group">
          <label className="wallet-label">当前连接钱包</label>
          <div className="wallet-address-row">
            <span className="wallet-address">
              {isLoadingAddress
                ? "获取地址中..."
                : isConnected
                ? formatWalletAddress(walletAddress)
                : "未连接钱包"}
            </span>
          </div>
        </div>

        <div className="wallet-balances">
          <div className="balance-item">
            <span className="balance-label">钱包余额:</span>
            <span className="balance-value">
              {isLoadingBalance
                ? "获取余额中..."
                : isConnected
                ? formatBalance(walletBalance, true)
                : "未连接钱包"}
            </span>
          </div>
          {/* <div className="balance-item">
            <span className="balance-label">已存入Nervos DAO:</span>
            <span className="balance-value">{depositedInDao} CKB</span>
          </div>
          <div className="balance-item">
            <span className="balance-label">赎回中:</span>
            <span className="balance-value">{redeeming} CKB</span>
          </div> */}
        </div>
      </div>

      <div className="action-buttons">
        <button className="action-button stake-button" onClick={handleStakeCKB}>
          <Image
            src="/nervos-logo-s.svg"
            alt="Nervos"
            width={16}
            height={16}
            className="button-icon"
          />
          质押CKB
        </button>

        <div className="neuron-dropdown-container" ref={dropdownRef}>
          <button
            className="action-button bind-button"
            onClick={handleBindNeuron}
          >
            <MdOutlineAccountBalanceWallet />
            绑定 Neuron 钱包地址
          </button>

          {showNeuronDropdown && (
            <div className="neuron-dropdown">
              <div
                className="neuron-dropdown-item"
                onClick={handleBindNewWallet}
              >
                绑定新钱包地址
              </div>
              {neuronWallets.map((wallet, index) => (
                <div key={index} className="neuron-wallet-item">
                  <span className="wallet-address">{wallet}</span>
                  <button
                    className="remove-wallet-button"
                    onClick={() => handleRemoveWallet(wallet)}
                  >
                    <MdClose />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 签名信息弹窗 */}
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onBind={handleSignatureBind}
        message={signatureMessage}
      />

      {/* 绑定成功弹窗 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        message="绑定成功!"
      />
    </div>
  );
}
