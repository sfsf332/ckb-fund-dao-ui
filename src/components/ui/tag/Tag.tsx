
"use client";

import React from "react";
import "./Tag.css";
import { ProposalStatus, getStatusText, getStatusTagClass } from "@/utils/proposalUtils";

interface TagProps {
  status: ProposalStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export default function Tag({ 
  status,
  size = "md", 
  className = "", 
  onClick 
}: TagProps) {
  const baseClasses = "tag tag-status";
  const sizeClasses = `tag-${size}`;
  const statusClasses = getStatusTagClass(status);
  const clickableClasses = onClick ? "tag-clickable" : "";
  const statusText = getStatusText(status);
  
  return (
    <span 
      className={`${baseClasses} ${statusClasses} ${sizeClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {statusText}
    </span>
  );
}
