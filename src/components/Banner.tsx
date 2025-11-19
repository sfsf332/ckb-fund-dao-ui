"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Banner() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // 监听窗口大小变化
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1280);
    };

    // 初始检查
    checkScreenSize();

    // 监听窗口大小变化
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div className="banner">
      <Image
        src={isSmallScreen ? "/slogan-m.svg" : "/slogan.svg"}
        alt="banner"
        width={isSmallScreen ? 640 : 1104}
        height={isSmallScreen ? 80 : 100}
       
      />
    </div>
  );
}
