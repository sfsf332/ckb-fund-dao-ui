'use client';

import { useState } from 'react';
import { GoDatabase ,GoCopy,GoCheckCircle} from "react-icons/go";
import { MdOutlinePrivacyTip } from "react-icons/md";

interface Web5IdentityCardProps {
  className?: string;
}

export default function Web5IdentityCard({ className = '' }: Web5IdentityCardProps) {
  const [did, setDid] = useState('did:web5:alice.example.com');
  const [pds, setPds] = useState('did:web5:alice.example.com');

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
