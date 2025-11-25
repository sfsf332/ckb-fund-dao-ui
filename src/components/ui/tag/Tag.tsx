
"use client";

import React from "react";
import "@/styles/Tag.css";
import { ProposalStatus, getStatusTagClass } from "@/utils/proposalUtils";
import { useTranslation } from "@/utils/i18n";

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
  const { t } = useTranslation();
  const baseClasses = "tag tag-status";
  const sizeClasses = `tag-${size}`;
  const statusClasses = getStatusTagClass(status);
  const clickableClasses = onClick ? "tag-clickable" : "";
  
  // 获取状态文本的多语言支持
  const getStatusText = (status: ProposalStatus): string => {
    switch (status) {
      case ProposalStatus.DRAFT:
        return t("proposalStatus.draft");
      case ProposalStatus.REVIEW:
        return t("proposalStatus.communityReview");
      case ProposalStatus.VOTE:
        return t("proposalStatus.voting");
      case ProposalStatus.MILESTONE:
        return t("proposalStatus.milestoneDelivery");
      case ProposalStatus.APPROVED:
        return t("proposalStatus.approved");
      case ProposalStatus.REJECTED:
        return t("proposalStatus.rejected");
      case ProposalStatus.ENDED:
        return t("proposalStatus.ended");
      default:
        return t("proposalStatus.unknown");
    }
  };
  
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
