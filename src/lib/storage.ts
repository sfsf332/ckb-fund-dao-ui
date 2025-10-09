/* eslint-disable @typescript-eslint/no-explicit-any */
const ACCESS_TOKEN_STORE_KEY = '@dao:client';
const USER_SESSION_COOKIE_KEY = 'dao_user_session';
const COOKIE_EXPIRE_DAYS = 7; // cookie 过期时间（天）

export type TokenStorageType = {
  did: string
  walletAddress: string
  signKey: string
}

export type UserSessionType = {
  did: string
  handle: string
  accessJwt: string
  refreshJwt: string
  ckbAddr: string
  cachedAt: number // 缓存时间戳
}

const clientRun = <T extends (...args: any[]) => any>(f: T) => {
  if (typeof window !== 'undefined') {
    return f;
  }
  return (() => {}) as unknown as T;
}

// Cookie 操作辅助函数
const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

const removeCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

const storage = {
  getItem: clientRun((key: string) => {
    return window.localStorage.getItem(key);
  }),
  setItem: clientRun((key: string, value: string) => {
    return window.localStorage.setItem(key, value);
  }),
  removeItem: clientRun((key: string) => {
    return window.localStorage.removeItem(key);
  }),
  clear: clientRun(() => {
    return window.localStorage.clear();
  }),
  setToken: clientRun((accTokenVal: TokenStorageType) => {
    console.log('🔐 保存用户信息到localStorage:', accTokenVal);
    window.localStorage.setItem(ACCESS_TOKEN_STORE_KEY, JSON.stringify(accTokenVal));
    console.log('✅ 用户信息已保存');
  }),
  getToken: clientRun(() => {
    const res = window.localStorage.getItem(ACCESS_TOKEN_STORE_KEY);
    console.log('🔍 从localStorage读取用户信息:', res);
    return res ? JSON.parse(res) as TokenStorageType : null;
  }),
  removeToken: clientRun(() => {
    console.log('🗑️ 从localStorage删除用户信息');
    return window.localStorage.removeItem(ACCESS_TOKEN_STORE_KEY);
  }),
  
  // Cookie 中缓存用户会话信息
  setUserSession: clientRun((session: UserSessionType) => {
    console.log('🍪 保存用户会话到Cookie:', { did: session.did, handle: session.handle });
    setCookie(USER_SESSION_COOKIE_KEY, JSON.stringify(session), COOKIE_EXPIRE_DAYS);
    console.log('✅ 用户会话已缓存到Cookie');
  }),
  
  getUserSession: clientRun((): UserSessionType | null => {
    const sessionStr = getCookie(USER_SESSION_COOKIE_KEY);
    if (!sessionStr) {
      console.log('🔍 Cookie中未找到用户会话');
      return null;
    }
    
    try {
      const session = JSON.parse(sessionStr) as UserSessionType;
      const now = Date.now();
      const cacheAge = now - session.cachedAt;
      const maxAge = COOKIE_EXPIRE_DAYS * 24 * 60 * 60 * 1000;
      
      if (cacheAge > maxAge) {
        console.log('⏰ Cookie中的用户会话已过期');
        removeCookie(USER_SESSION_COOKIE_KEY);
        return null;
      }
      
      console.log('🔍 从Cookie读取用户会话:', { did: session.did, handle: session.handle });
      return session;
    } catch (error) {
      console.error('❌ 解析Cookie中的用户会话失败:', error);
      removeCookie(USER_SESSION_COOKIE_KEY);
      return null;
    }
  }),
  
  removeUserSession: clientRun(() => {
    console.log('🗑️ 删除Cookie中的用户会话');
    removeCookie(USER_SESSION_COOKIE_KEY);
  }),
}

export default storage;