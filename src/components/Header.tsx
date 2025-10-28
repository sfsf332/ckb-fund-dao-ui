"use client";

import React, { useState } from "react";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";
import { usePathname } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";
import { useTranslation } from "@/utils/i18n";
import { LoginModal } from "./user-login";
import useUserInfoStore from "@/store/userInfo";
import "./user-login/LoginModal.css";


export default function Header() {
    const pathname = usePathname();
    const { locale } = useI18n();
    const { t } = useTranslation();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { userInfo } = useUserInfoStore();
    
    // 提取 handle 第一个 . 前面的部分
    const getUserDisplayName = () => {
      if (!userInfo) return '';
      if (userInfo.handle) {
        return userInfo.handle.split('.')[0];
      }
      return userInfo.did;
    };
 
    const homeHref = `/${locale}`;
    const treasuryHref = `/${locale}/treasury`;
    const managementHref = `/${locale}/management`;
    const userCenterHref = `/${locale}/user-center`;
    const ruleHref = `https://pebble-lumber-0be.notion.site/Community-Fund-DAO-v1-1-Web5-23924205dae080ed9290e95519c57ab1`;

    const isActive = (href: string) => {
      if (!pathname) return false;
      // 主页需要精确匹配 locale 根
      if (href === homeHref) {
        return pathname === homeHref || pathname === `${homeHref}/`;
      }
      return pathname.startsWith(href);
    };

  return (
    <div className="header-container">
      <div className="logo">
        <Image src="/header_logo.svg" width={330} height={36} alt="CKB Community Fund DAO" priority />
      
      </div>
      <ul className="navs">
        <li>
          <Link href={homeHref} className={isActive(homeHref) ? "active" : ""}>{t("header.governanceHome")}</Link>
        </li>
        <li>
          <Link href={treasuryHref} className={isActive(treasuryHref) ? "active" : ""}>{t("header.treasury")}</Link>
        </li>
        <li>
          <Link href={managementHref} className={isActive(managementHref) ? "active" : ""}>{t("header.propertyInfo")}</Link>
        </li>
        <li>
          <Link href={userCenterHref} className={isActive(userCenterHref) ? "active" : ""}>{t("header.userCenter")}</Link>
        </li>
        <li>
          <Link href={ruleHref}  className={isActive(ruleHref) ? "active" : ""}>{t("header.governanceRules")}</Link>
        </li>
      </ul>
      <div className="header-actions">
        <LanguageSwitcher />
        <Link href={`${homeHref}/proposal/create`} className="button-secondary">
          <CiCirclePlus /> {t("header.createProposal")}
        </Link>
        {userInfo ? (
          <div 
            className="user-dropdown-container"
          
          >
            <button className="button-normal user-button">
              
              {getUserDisplayName()}
             
            </button>
            
           
          </div>
        ) : (
          <button onClick={() => setIsLoginModalOpen(true)} className="button-normal">{t("header.login")}</button>
        )}
        {/* <button
          onClick={open}
          className="button-normal"
        >
          Connect Wallet
        </button> */}
      </div>
      
      {/* 登录弹窗 */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}
