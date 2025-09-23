'use client';

import React from 'react';
import Modal from './Modal';

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
  confirmText = '确认',
  cancelText = '取消',
  variant = 'info',
  title = '确认操作'
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      buttons={[
        {
          text: cancelText,
          onClick: onClose,
          variant: 'secondary'
        },
        {
          text: confirmText,
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
