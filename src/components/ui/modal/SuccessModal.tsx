'use client';

import React from 'react';
import { MdCheck } from 'react-icons/md';
import Modal from './Modal';
import { useI18n } from '@/contexts/I18nContext';

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  icon?: React.ReactNode;
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  message, 
  icon
}: SuccessModalProps) {
  const { messages } = useI18n();
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      showCloseButton={false}
      buttons={[
        {
          text: messages.modal.successModal.close,
          onClick: onClose,
          variant: 'secondary'
        }
      ]}
    >
      <div className="success-content">
        <div className="success-icon">
          {icon || <MdCheck />}
        </div>
        <p className="success-message">{message || messages.modal.successModal.defaultMessage}</p>
      </div>
    </Modal>
  );
}
