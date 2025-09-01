'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // 检测用户首选语言
    const savedLocale = localStorage.getItem('locale');
    const browserLang = navigator.language.split('-')[0];
    
    let defaultLocale = 'en';
    if (savedLocale && ['en', 'zh'].includes(savedLocale)) {
      defaultLocale = savedLocale;
    } else if (browserLang === 'zh') {
      defaultLocale = 'zh';
    }
    
    // 重定向到默认语言页面
    router.replace(`/${defaultLocale}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">正在加载...</h1>
        <p className="text-gray-600">正在为您选择合适的语言</p>
      </div>
    </div>
  );
}
