"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillDiscord } from "react-icons/ai";
import { RiTwitterXFill } from "react-icons/ri";
import { FaTelegramPlane ,FaMediumM} from "react-icons/fa";
import { useTranslation } from "@/utils/i18n";

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* 左侧：公司标识和社交媒体 */}
        <div className="footer-left">
          <div className="company-info">
            <div className="logo-title">
              <div className="logo">
                <Image 
                  src="/nervos-logo.svg" 
                  alt="Nervos Logo" 
                  width={32} 
                  height={32} 
                  priority 
                />
              </div>
              <span className="company-name">{t("footer.companyName")}</span>
            </div>
            
            <div className="social-links">
              <div className="social-column">
                <Link href="#" className="social-link">
                  <RiTwitterXFill className="social-icon" />
                  <span>{t("footer.twitter")}</span>
                </Link>
                <Link href="#" className="social-link">
                  <FaTelegramPlane className="social-icon" />
                  <span>{t("footer.telegram")}</span>
                </Link>
              </div>
              <div className="social-column">
                <Link href="#" className="social-link">
                  <AiFillDiscord  className="social-icon" />
                  <span>{t("footer.discord")}</span>
                </Link>
                <Link href="#" className="social-link">
                  <FaMediumM className="social-icon" />
                  <span>{t("footer.medium")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：导航链接 */}
        <div className="footer-right">
          <div className="nav-section">
            <h3 className="nav-heading">{t("footer.support")}</h3>
            <ul className="nav-links">
              <li><Link href="#">{t("footer.privacyPolicy")}</Link></li>
              <li><Link href="#">{t("footer.termsAndConditions")}</Link></li>
              <li><Link href="#">{t("footer.mediaKit")}</Link></li>
            </ul>
          </div>
          
          <div className="nav-section">
            <h3 className="nav-heading">{t("footer.link")}</h3>
            <ul className="nav-links">
              <li><Link href="#">{t("footer.docs")}</Link></li>
              <li><Link href="#">{t("footer.nervos")}</Link></li>
              <li><Link href="#">{t("footer.download")}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
