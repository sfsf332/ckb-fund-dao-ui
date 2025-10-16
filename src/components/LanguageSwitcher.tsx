'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useI18n } from '../contexts/I18nContext';
import { PiGlobeLight } from "react-icons/pi";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = React.useState(false);
  const [isHovered, setIsHovered] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLanguageChange = (newLocale: 'en' | 'zh') => {
    if (!isClient) return;
    
    setLocale(newLocale);
    
    // 更新URL路径
    const currentPath = pathname;
    const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${newLocale}`);
    router.push(newPath);
  };

  // 语言选项
  const languages: Array<{ code: 'en' | 'zh', name: string, display: string }> = [
    { code: 'zh', name: '简体中文', display: 'ZH' },
    { code: 'en', name: 'English', display: 'EN' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <div 
      className="language-switcher-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="language-switcher">
        <PiGlobeLight />
        {currentLanguage.display}
      </button>
      
      {isHovered && (
        <div className="language-dropdown">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${language.code === locale ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
