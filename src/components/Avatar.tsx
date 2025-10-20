import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  size?: number;
  className?: string;
  alt?: string;
}

export default function Avatar({ 
  size = 24, 
  className = '', 
  alt = 'User Avatar' 
}: AvatarProps) {
  return (
    <div className={`avatar-container ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/avatar.svg"
        alt={alt}
        width={size}
        height={size}
        className="avatar-image"
      />
    </div>
  );
}
