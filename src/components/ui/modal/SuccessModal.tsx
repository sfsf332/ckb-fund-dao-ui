'use client';

import React from 'react';
import { MdCheck } from 'react-icons/md';
import Modal from './Modal';

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  icon?: React.ReactNode;
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  message = '操作成功!',
  icon
}: SuccessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      showCloseButton={false}
      buttons={[
        {
          text: '关闭',
          onClick: onClose,
          variant: 'secondary'
        }
      ]}
    >
      <div className="success-content">
        <div className="success-icon">
          {icon || <MdCheck />}
        </div>
        <p className="success-message">{message}</p>
      </div>
    </Modal>
  );
}
