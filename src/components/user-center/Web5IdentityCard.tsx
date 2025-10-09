'use client';

import { useState, useEffect } from 'react';
import { GoDatabase ,GoCopy,GoCheckCircle} from "react-icons/go";
import { MdOutlinePrivacyTip } from "react-icons/md";
import storage from '@/lib/storage';
import useUserInfoStore from '@/store/userInfo';
import getPDSClient from '@/lib/pdsClient';

interface Web5IdentityCardProps {
  className?: string;
}

export default function Web5IdentityCard({ className = '' }: Web5IdentityCardProps) {
  const { userInfo } = useUserInfoStore();
  const [did, setDid] = useState('');
  const [pds, setPds] = useState('');

  // 从本地存储和用户信息中获取 DID 和 PDS
  useEffect(() => {
    // 优先从 userInfo 获取
    if (userInfo?.did) {
      setDid(userInfo.did);
    } else {
      // 如果 userInfo 没有，尝试从 localStorage 获取
      const tokenData = storage.getToken();
      if (tokenData?.did) {
        setDid(tokenData.did);
      }
    }

    // 获取 PDS 地址
    try {
      const pdsClient = getPDSClient();
      if (pdsClient?.serviceUrl?.origin) {
        setPds(pdsClient.serviceUrl.origin);
      }
    } catch (error) {
      console.error('获取 PDS 地址失败:', error);
    }
  }, [userInfo]);

  const privacySettings = [
    { label: '数据加密:', status: '启用', enabled: true },
    { label: '匿名浏览:', status: '启用', enabled: true },
    { label: '数据备份:', status: '自动', enabled: true },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // 这里可以添加复制成功的提示
  };

  return (
    <div className={`web5-identity-card ${className}`}>
      <h3 className="card-title">Web5 身份</h3>
      
      <div className="identity-section">
        <div className="field-group">
          <label className="field-label">去中心化身份(DID)</label>
          <div className="input-group">
            <input
              type="text"
              value={did}
              readOnly
              className="field-input"
            />
            <button
              className="copy-button"
              onClick={() => copyToClipboard(did)}
              title="复制"
            >
              <GoCopy />
            </button>
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">个人数据存储(PDS)</label>
          <div className="input-group">
            <input
              type="text"
              value={pds}
              readOnly
              className="field-input"
            />
            <button
              className="external-link-button"
              title="打开链接"
            >
              <GoDatabase />
            </button>
          </div>
        </div>
      </div>

      <div className="privacy-section">
        <div className="privacy-header">
        <MdOutlinePrivacyTip />
          <h4 className="privacy-title">隐私控制</h4>
        </div>
        
        <div className="privacy-settings">
          {privacySettings.map((setting, index) => (
            <div key={index} className="privacy-item">
              <span className="privacy-label">{setting.label}</span>
              <div className="privacy-status">
              <span className="status-icon"><GoCheckCircle /></span>
                <span className="status-text">{setting.status}</span>
              
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
