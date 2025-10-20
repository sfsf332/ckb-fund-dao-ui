'use client';

import React from 'react';
import './copy.css';
import { FaCopy } from 'react-icons/fa';
import { handleCopy } from '@/utils/common';

interface CopyButtonProps {
  text: string;
  className?: string;
  ariaLabel?: string;
  onCopied?: () => void;
  children?: React.ReactNode;
  iconSize?: number;
  title?: string;
  style?: React.CSSProperties;
}

export default function CopyButton({
  text,
  className = '',
  ariaLabel,
  onCopied,
  children,
  iconSize,
  title,
  style,
}: CopyButtonProps) {
  const onClick = () => {
    handleCopy(text);
    if (onCopied) onCopied();
  };

  return (
    <button
      className={`copy-button-reset ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      type="button"
      style={style}
    >
      {children ?? <FaCopy size={iconSize} />}
    </button>
  );
}


