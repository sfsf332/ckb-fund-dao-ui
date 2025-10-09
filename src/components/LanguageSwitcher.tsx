'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useI18n } from '../contexts/I18nContext';
import { PiGlobeLight } from "react-icons/pi";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLanguageChange = () => {
    if (!isClient) return;
    
    const newLocale = locale === 'en' ? 'zh' : 'en';
    setLocale(newLocale);
    
    // 更新URL路径
    const currentPath = pathname;
    const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${newLocale}`);
    router.push(newPath);
  };

  // 显示当前非活跃的语言
  const displayText = locale === 'en' ? '中文' : 'English';

  return (
    <button
      onClick={handleLanguageChange}
      className="language-switcher"
    >
      <PiGlobeLight />
      {displayText}
    </button>
  );
}
