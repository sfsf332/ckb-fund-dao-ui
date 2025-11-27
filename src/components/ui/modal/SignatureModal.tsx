'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { GoCopy } from 'react-icons/go';
import CopyButton from '@/components/ui/copy/CopyButton';
import { useI18n } from '@/contexts/I18nContext';

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
  const { messages } = useI18n();
  const [signature, setSignature] = useState('');

  const handleBind = () => {
    if (signature.trim()) {
      onBind(signature);
      setSignature('');
    }
  };

  

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={messages.modal.signatureModal.title}
      size="large"
      buttons={[
        {
          text: messages.modal.signatureModal.bind,
          onClick: handleBind,
          variant: 'primary',
          disabled: !signature.trim()
        },
        {
          text: messages.modal.signatureModal.close,
          onClick: onClose,
          variant: 'secondary'
        }
      ]}
    >
      <div className="signature-content">
        <div className="message-section">
          <div>
            <span className="message-text">{message}</span>
            <CopyButton
              className="copy-button"
              text={message}
              title={messages.modal.signatureModal.copy}
            >
              <GoCopy />
            </CopyButton>
          </div>
          {/* <p className="message-instruction">
            {messages.modal.signatureModal.messageInstruction}
          </p> */}
        </div>
        
        <div className="signature-section">
          <textarea
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="signature-input"
            placeholder={messages.modal.signatureModal.signaturePlaceholder}
          />
        </div>
      </div>
    </Modal>
  );
}
