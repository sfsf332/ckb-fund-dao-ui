'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { usePathname } from 'next/navigation';
import enMessages from '../locales/en.json';
import zhMessages from '../locales/zh.json';

type Locale = 'en' | 'zh';

interface Messages {
  common: {
    getStarted: string;
    saveAndSee: string;
    deployNow: string;
    readDocs: string;
    learn: string;
    examples: string;
    goToNextjs: string;
  };
  navigation: {
    home: string;
    about: string;
    contact: string;
  };
  footer: {
    learn: string;
    examples: string;
    goToNextjs: string;
  };
}

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Messages;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const messages: Record<Locale, Messages> = {
  en: enMessages,
  zh: zhMessages,
};

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>(initialLocale || 'en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    if (initialLocale) {
      setLocale(initialLocale);
      return;
    }
    
    // 从URL路径中获取语言代码
    const pathLocale = pathname.split('/')[1] as Locale;
    if (pathLocale && ['en', 'zh'].includes(pathLocale)) {
      setLocale(pathLocale);
    } else {
      // 从localStorage或浏览器语言设置中获取语言偏好
      try {
        const savedLocale = localStorage.getItem('locale') as Locale;
        if (savedLocale && ['en', 'zh'].includes(savedLocale)) {
          setLocale(savedLocale);
        } else {
          // 检测浏览器语言
          const browserLang = navigator.language.split('-')[0];
          if (browserLang === 'zh') {
            setLocale('zh');
          }
        }
      } catch (error) {
        // 如果localStorage不可用，使用默认语言
        console.warn('localStorage not available:', error);
      }
    }
  }, [pathname, initialLocale, isClient]);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    if (isClient) {
      try {
        localStorage.setItem('locale', newLocale);
        // 更新HTML lang属性
        document.documentElement.lang = newLocale;
      } catch (error) {
        console.warn('Failed to save locale to localStorage:', error);
      }
    }
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, messages: messages[locale] }}>
      <IntlProvider locale={locale} messages={messages[locale] as unknown as Record<string, string>}>
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
