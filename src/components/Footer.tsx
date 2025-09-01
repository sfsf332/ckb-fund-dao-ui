"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillDiscord } from "react-icons/ai";
import { RiTwitterXFill } from "react-icons/ri";
import { FaTelegramPlane ,FaMediumM} from "react-icons/fa";

export default function Footer() {
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
              <span className="company-name">CKB Community Fund DAO</span>
            </div>
            
            <div className="social-links">
              <div className="social-column">
                <Link href="#" className="social-link">
                  <RiTwitterXFill className="social-icon" />
                  <span>Twitter</span>
                </Link>
                <Link href="#" className="social-link">
                  <FaTelegramPlane className="social-icon" />
                  <span>Telegram</span>
                </Link>
              </div>
              <div className="social-column">
                <Link href="#" className="social-link">
                  <AiFillDiscord  className="social-icon" />
                  <span>Discord</span>
                </Link>
                <Link href="#" className="social-link">
                  <FaMediumM className="social-icon" />
                  <span>Medium</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：导航链接 */}
        <div className="footer-right">
          <div className="nav-section">
            <h3 className="nav-heading">Support</h3>
            <ul className="nav-links">
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms and Conditions</Link></li>
              <li><Link href="#">Media Kit</Link></li>
            </ul>
          </div>
          
          <div className="nav-section">
            <h3 className="nav-heading">Link</h3>
            <ul className="nav-links">
              <li><Link href="#">Docs</Link></li>
              <li><Link href="#">Nervos</Link></li>
              <li><Link href="#">Download</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
