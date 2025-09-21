import React from "react";
import { AiOutlineCloseCircle, AiOutlineExport } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";
import { FaCopy } from "react-icons/fa";
import { handleCopy } from "@/utils/common";
interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface FormData {
  proposalType: string;
  title: string;
  releaseDate: string;
  background: string;
  goals: string;
  team: string;
  budget: string;
  milestones: Milestone[];
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  formData,
}) => {
  if (!isOpen) return null;
console.log(formData)
  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="proposal-header">
          <h2>{formData.title}</h2>
          <button type="button" onClick={onClose} className="preview-close-btn">
            <AiOutlineCloseCircle size={20} color="#777" />
          </button>
          <div className="proposal-info">
            <div className="user_info">
              <Image src="/avatar.jpg" alt="avatar" width={32} height={32} />
              <div className="name">
                <h3>John</h3>
                <p>
                  did:ckb:ckt1qvqr...7q2h
                  <button
                    className="button-copy"
                    onClick={() => handleCopy("did:ckb:ckt1qvqr...7q2h")}
                    aria-label="copy-treasury-address"
                  >
                    <FaCopy />
                  </button>
                  <Link href="#" aria-label="export-treasury-address">
                    <AiOutlineExport />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="proposal-content">
          <div className="proposal-section">
            <h3>基本信息</h3>
            <div className="proposal-field">
              <label>提案类型:</label>
              <span>{formData.proposalType || "未填写"}</span>
            </div>

            <div className="proposal-field">
              <label>发布日期:</label>
              <span>{formData.releaseDate || "未填写"}</span>
            </div>
          </div>

          <div className="proposal-section">
            <h3>项目背景</h3>
            <div
              className="proposal-html-content"
              dangerouslySetInnerHTML={{
                __html: formData.background || "未填写",
              }}
            />
          </div>

          <div className="proposal-section">
            <h3>项目目标</h3>
            <div
              className="proposal-html-content"
              dangerouslySetInnerHTML={{ __html: formData.goals || "未填写" }}
            />
          </div>

          <div className="proposal-section">
            <h3>团队介绍</h3>
            <div
              className="proposal-html-content"
              dangerouslySetInnerHTML={{ __html: formData.team || "未填写" }}
            />
          </div>

          <div className="proposal-section">
            <h3>项目预算</h3>
            <div className="proposal-field">
              <label>预算金额 (CKB):</label>
              <span>{formData.budget || "未填写"}</span>
            </div>
          </div>

          <div className="proposal-section">
            <h3>项目里程碑</h3>
            {formData.milestones.length === 0 ? (
              <p>未添加任何里程碑</p>
            ) : (
              <div className="proposal-milestones">
                {formData.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="proposal-milestone">
                    <h4>
                      里程碑 {index + 1}: {milestone.title || "未命名"}
                    </h4>
                    <div className="proposal-field">
                      <label>预计完成日期:</label>
                      <span>{milestone.date || "未设置"}</span>
                    </div>
                    <div className="proposal-field">
                      <label>详细描述:</label>
                      <div
                        className="proposal-html-content"
                        dangerouslySetInnerHTML={{
                          __html: milestone.description || "未填写",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="preview-modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            关闭预览
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
