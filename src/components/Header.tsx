"use client";

import React, { useState } from "react";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";
import { usePathname } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";
import { LoginModal } from "./user-login";
import useUserInfoStore from "@/store/userInfo";
import "./user-login/LoginModal.css";
import router from "next/router";

export default function Header() {
    const pathname = usePathname();
    const { locale } = useI18n();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { userInfo, logout } = useUserInfoStore();
    
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
        <Image src="/nervos-logo.svg" alt="logo" width={36} height={36} priority />
        <span>CKB Community Fund DAO</span>
        <span className="version">V1.1</span>
      </div>
      <ul className="navs">
        <li>
          <Link href={homeHref} className={isActive(homeHref) ? "active" : ""}>治理主页</Link>
        </li>
        <li>
          <Link href={treasuryHref} className={isActive(treasuryHref) ? "active" : ""}>金库</Link>
        </li>
        <li>
          <Link href={managementHref} className={isActive(managementHref) ? "active" : ""}>物业信息</Link>
        </li>
        <li>
          <Link href={userCenterHref} className={isActive(userCenterHref) ? "active" : ""}>用户中心</Link>
        </li>
        <li>
          <Link href={ruleHref}  className={isActive(ruleHref) ? "active" : ""}>治理规则</Link>
        </li>
      </ul>
      <div className="header-actions">
        <LanguageSwitcher />
        <Link href={`${homeHref}/proposal/create`} className="button-secondary">
          <CiCirclePlus /> 发起提案
        </Link>
        {userInfo ? (
          <Link  href={userCenterHref} className="button-normal" >
            {getUserDisplayName()}
          </Link>
        ) : (
          <button onClick={() => setIsLoginModalOpen(true)} className="button-normal">Login</button>
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
