'use client';

import React from 'react';
import Modal from './Modal';
import { useI18n } from '@/contexts/I18nContext';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  title?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  message,
  onConfirm,
  confirmText,
  cancelText,
  variant = 'info',
  title
}: ConfirmModalProps) {
  const { messages } = useI18n();
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || messages.modal.confirmModal.defaultTitle}
      size="small"
      buttons={[
        {
          text: cancelText || messages.modal.confirmModal.defaultCancel,
          onClick: onClose,
          variant: 'secondary'
        },
        {
          text: confirmText || messages.modal.confirmModal.defaultConfirm,
          onClick: handleConfirm,
          variant: variant === 'danger' ? 'danger' : 'primary'
        }
      ]}
    >
      <div className="confirm-content">
        <p className="confirm-message">{message}</p>
      </div>
    </Modal>
  );
}
