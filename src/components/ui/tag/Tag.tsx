
"use client";

import React from "react";
import "./Tag.css";

interface TagProps {
  children: React.ReactNode;
  type?: "default" | "status" | "budget" | "category" | "priority" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export default function Tag({ 
  children, 
  type = "default", 
  size = "md", 
  className = "", 
  onClick 
}: TagProps) {
  const baseClasses = "tag";
  const typeClasses = `tag-${type}`;
  const sizeClasses = `tag-${size}`;
  const clickableClasses = onClick ? "tag-clickable" : "";
  
  return (
    <span 
      className={`${baseClasses} ${typeClasses} ${sizeClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
