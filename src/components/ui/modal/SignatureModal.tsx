'use client';

import React, { useState } from 'react';
import { MdContentCopy } from 'react-icons/md';
import Modal from './Modal';

export interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onBind: (signature: string) => void;
}

export default function SignatureModal({ 
  isOpen, 
  onClose, 
  message, 
  onBind 
}: SignatureModalProps) {
  const [signature, setSignature] = useState('');

  const handleBind = () => {
    if (signature.trim()) {
      onBind(signature);
      setSignature('');
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="签名信息"
      size="medium"
      buttons={[
        {
          text: '绑定',
          onClick: handleBind,
          variant: 'primary',
          disabled: !signature.trim()
        },
        {
          text: '关闭',
          onClick: onClose,
          variant: 'secondary'
        }
      ]}
    >
      <div className="signature-content">
        <div className="message-section">
          <div>
            <span className="message-text">{message}</span>
            <button  onClick={handleCopyMessage}>
              <MdContentCopy />
            </button>
          </div>
          <p className="message-instruction">
            该消息将使用&quot;Nervos Message&quot;进行签名
          </p>
        </div>
        
        <div className="signature-section">
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="signature-input"
            placeholder="请输入签名"
          />
        </div>
      </div>
    </Modal>
  );
}
