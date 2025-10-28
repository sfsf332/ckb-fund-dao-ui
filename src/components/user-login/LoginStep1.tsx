"use client";

import React from "react";
import Image from "next/image";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { ccc } from "@ckb-ccc/connector-react";
import { useTranslation } from "@/utils/i18n";

interface LoginStep1Props {
  onDisconnect?: () => void;
}

export default function LoginStep1({ onDisconnect }: LoginStep1Props) {
  const { t } = useTranslation();
  const { wallet, signerInfo } = ccc.useCcc();
  const isConnected = !!wallet && !!signerInfo;
  
  // 获取钱包地址并格式化
  const [walletAddress, setWalletAddress] = React.useState<string>("");
  
  React.useEffect(() => {
    if (signerInfo?.signer) {
      signerInfo.signer.getAddresses().then(addresses => {
        if (addresses.length > 0) {
          setWalletAddress(addresses[0]);
        }
      });
    }
  }, [signerInfo]);
  
  // 格式化地址显示（显示前10位...后10位）
  const formatAddress = (address: string) => {
    if (!address) return "";
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-10)}`;
  };
  
  // 复制地址到剪贴板
  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
    }
  };
  
  return (
    <>
      <div className="login-content">
        <div className="login-info-section">
          <h3 className="login-info-title">
            {t("loginStep1.createWeb5Account")}
          </h3>
          <ul className="login-benefits">
            <li>{t("loginStep1.benefit1")}</li>
            <li>{t("loginStep1.benefit2")}</li>
            <li>{t("loginStep1.benefit3")}</li>
          </ul>
          {isConnected && (
            <div className="wallet-status">
              <p className="wallet-connected">✅ {t("loginStep1.walletConnected")}</p>
              <p 
                className="wallet-address" 
                onClick={copyAddress} 
                style={{ cursor: 'pointer' }} 
                title={t("loginStep1.clickToCopyAddress")}
              >
                {t("loginStep1.wallet")}: {formatAddress(walletAddress)}
              </p>
              <div className="wallet-controls">
                <button 
                  className="wallet-control-btn disconnect-btn"
                  onClick={onDisconnect}
                >
                  {t("loginStep1.disconnect")}
                </button>
              
              </div>
            </div>
          )}
        </div>
        <div className="login-graphic-section">
          <Image src="/login-bg.png" alt="login-graphic" width={224} height={160} />
        </div>
      </div>
      <div>
        <a href="#" className="login-info-link">
          {t("loginStep1.whatIsWeb5")}
          <IoMdInformationCircleOutline
            data-tooltip-id="my-tooltip"
            data-tooltip-content={t("loginStep1.web5Explanation")}
          />
        </a>
      </div>
    </>
  );
}
