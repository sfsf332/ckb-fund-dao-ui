"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "../../../../utils/i18n";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaCopy } from "react-icons/fa";
import { AiOutlineExport } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";
import { handleCopy } from "@/utils/common";
import "../create/create-proposal.css";

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface Proposal {
  id: string;
  proposalType: string;
  title: string;
  releaseDate: string;
  background: string;
  goals: string;
  team: string;
  budget: string;
  milestones: Milestone[];
  status: string;
  createdAt: string;
  author: {
    name: string;
    did: string;
    avatar: string;
  };
}

const steps = [
  { id: 1, name: "提案设置", description: "基本设置信息" },
  { id: 2, name: "项目背景", description: "项目背景介绍" },
  { id: 3, name: "项目目标", description: "项目目标规划" },
  { id: 4, name: "团队介绍", description: "团队信息介绍" },
  { id: 5, name: "项目预算", description: "预算规划设置" },
  { id: 6, name: "里程碑", description: "项目里程碑规划" },
];

export default function ProposalDetail() {
  useTranslation();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // TODO: 从 URL 参数或 API 获取提案详情
    const loadProposal = async () => {
      try {
        setLoading(true);
        // 模拟数据加载
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProposal({
          id: "1",
          proposalType: "funding",
          title: "CKB 生态系统开发基金申请",
          releaseDate: "2024-01-15",
          background: "<h2>项目背景</h2><p>随着 Nervos CKB 生态系统的不断发展，我们需要更多的开发者工具和基础设施来支持社区建设。本项目旨在开发一套完整的开发者工具链，包括：</p><ul><li>智能合约开发框架</li><li>测试网络部署工具</li><li>社区治理平台</li></ul><p>这些工具将大大降低开发者的入门门槛，加速生态发展。</p>",
          goals: "<h2>项目目标</h2><p>我们的主要目标是：</p><ol><li><strong>提升开发体验</strong>：通过完善的工具链，让开发者能够更高效地构建 CKB 应用</li><li><strong>降低开发成本</strong>：提供免费的开源工具，减少开发者的学习成本</li><li><strong>促进生态繁荣</strong>：通过更好的开发体验吸引更多开发者加入 CKB 生态</li></ol>",
          team: "<h2>团队介绍</h2><p>我们是一支经验丰富的区块链开发团队：</p><ul><li><strong>技术负责人</strong>：5年区块链开发经验，曾参与多个知名项目</li><li><strong>前端工程师</strong>：3年 React/Next.js 开发经验</li><li><strong>后端工程师</strong>：4年 Rust/Go 开发经验，熟悉 CKB 架构</li><li><strong>产品经理</strong>：2年 DeFi 产品经验，深度理解用户需求</li></ul>",
          budget: "500000",
          milestones: [
            {
              id: "1",
              title: "开发框架设计",
              description: "<p>完成智能合约开发框架的架构设计和核心功能开发，包括：</p><ul><li>合约模板库</li><li>调试工具</li><li>部署脚本</li></ul>",
              date: "2024-02-15"
            },
            {
              id: "2", 
              title: "测试网络工具",
              description: "<p>开发测试网络部署和管理工具：</p><ul><li>一键部署脚本</li><li>网络监控面板</li><li>数据同步工具</li></ul>",
              date: "2024-03-30"
            },
            {
              id: "3",
              title: "社区治理平台",
              description: "<p>构建社区治理和投票平台：</p><ul><li>提案管理系统</li><li>投票机制</li><li>结果统计</li></ul>",
              date: "2024-05-15"
            }
          ],
          status: "active",
          createdAt: new Date().toISOString(),
          author: {
            name: "CKB Dev Team",
            did: "did:ckb:ckt1qvqr...7q2h",
            avatar: "/avatar.jpg"
          }
        });
      } catch (err) {
        setError("加载提案失败");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProposal();
  }, []);

  const getProposalTypeText = (type: string) => {
    const types: { [key: string]: string } = {
      funding: "资金申请",
      governance: "治理提案", 
      technical: "技术提案",
      community: "社区提案"
    };
    return types[type] || "未知类型";
  };

  const getStatusText = (status: string) => {
    const statuses: { [key: string]: string } = {
      active: "进行中",
      completed: "已完成",
      cancelled: "已取消",
      pending: "待审核"
    };
    return statuses[status] || "未知状态";
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: "#00CC9B",
      completed: "#10B981", 
      cancelled: "#EF4444",
      pending: "#F59E0B"
    };
    return colors[status] || "#6B7280";
  };



  if (loading) {
    return (
      <div className="container">
        <main>
          <div className="main-content">
            <div className="step-container">
              <div className="flex justify-center items-center h-64">
                <div className="text-lg text-white">加载中...</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <main>
          <div className="main-content">
            <div className="step-container">
              <div className="flex justify-center items-center h-64">
                <div className="text-red-500">{error}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="container">
        <main>
          <div className="main-content">
            <div className="step-container">
              <div className="flex justify-center items-center h-64">
                <div className="text-white">提案不存在</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <main>
        <div className="proposal-detail-layout">
          {/* 面包屑导航 */}
          <div className="breadcrumb">
            <span>治理主页</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span>{proposal.title}</span>
          </div>

          <div className="proposal-content-wrapper">
            {/* 左侧主要内容 */}
            <div className="proposal-main-content">
              {/* 提案头部信息 */}
              <div className="proposal-header-card">
                <div className="proposal-title-section">
                  <h1 className="proposal-main-title">{proposal.title}</h1>
                  
                  <div className="proposal-author-info">
                    <div className="author-avatar">
                      <Image src={proposal.author.avatar} alt="avatar" width={40} height={40} />
                    </div>
                    <div className="author-details">
                      <div className="author-name">{proposal.author.name}</div>
                      <div className="author-did">
                        {proposal.author.did}
                        <button
                          className="copy-btn"
                          onClick={() => handleCopy(proposal.author.did)}
                          aria-label="copy-author-did"
                        >
                          <FaCopy size={12} />
                        </button>
                        <Link href="#" aria-label="export-author-did">
                          <AiOutlineExport size={12} />
                        </Link>
                      </div>
                    </div>
                  
                  </div>

                  <div className="proposal-meta-tags">
                    <span className="meta-tag date-tag">
                      {new Date(proposal.createdAt).toLocaleDateString('zh-CN', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="meta-tag type-tag">
                      {getProposalTypeText(proposal.proposalType)}
                    </span>
                    <span className="meta-tag budget-tag">
                      {proposal.budget ? `${Number(proposal.budget).toLocaleString()}.000 CKB` : "未设置预算"}
                    </span>
                    <span 
                      className="meta-tag status-tag"
                    >
                      {getStatusText(proposal.status)}
                    </span>
                  </div>

                  <div className="proposal-actions">
                    <button className="action-btn primary-btn">
                      提案详细
                    </button>
                    <button className="action-btn secondary-btn">
                      社区讨论 (18)
                    </button>
                  </div>
                </div>
              </div>

              {/* 所有步骤内容按顺序展示 */}
              {steps.map((step, index) => (
                <div key={step.id} className="proposal-step-content">
                  <div className="step-title-container">
                    <h2 className="step-title">
                      {step.name}{" "}
                      <IoMdInformationCircleOutline
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={step.description}
                      />
                    </h2>
                  </div>

                  <div className="step-content">
                    {(() => {
                      switch (step.id) {
                        case 1: // 提案设置
                          return (
                            <div className="form-fields">
                              <div className="proposal-field">
                                <label className="form-label">提案类型:</label>
                                <span className="proposal-value">{getProposalTypeText(proposal.proposalType)}</span>
                              </div>
                              <div className="proposal-field">
                                <label className="form-label">提案标题:</label>
                                <span className="proposal-value">{proposal.title}</span>
                              </div>
                              <div className="proposal-field">
                                <label className="form-label">发布日期:</label>
                                <span className="proposal-value">{proposal.releaseDate}</span>
                              </div>
                              <div className="proposal-field">
                                <label className="form-label">提案状态:</label>
                                <span 
                                  className="proposal-value" 
                                  style={{ color: getStatusColor(proposal.status) }}
                                >
                                  {getStatusText(proposal.status)}
                                </span>
                              </div>
                            </div>
                          );

                        case 2: // 项目背景
                          return (
                            <div className="form-fields">
                              <div className="proposal-html-content"
                                dangerouslySetInnerHTML={{ __html: proposal.background || "未填写" }}
                              />
                            </div>
                          );

                        case 3: // 项目目标
                          return (
                            <div className="form-fields">
                              <div className="proposal-html-content"
                                dangerouslySetInnerHTML={{ __html: proposal.goals || "未填写" }}
                              />
                            </div>
                          );

                        case 4: // 团队介绍
                          return (
                            <div className="form-fields">
                              <div className="proposal-html-content"
                                dangerouslySetInnerHTML={{ __html: proposal.team || "未填写" }}
                              />
                            </div>
                          );

                        case 5: // 项目预算
                          return (
                            <div className="form-fields">
                              <div className="proposal-field">
                                <label className="form-label">预算金额 (CKB):</label>
                                <span className="proposal-value">{proposal.budget ? `${Number(proposal.budget).toLocaleString()}.000 CKB` : "未填写"}</span>
                              </div>
                            </div>
                          );

                        case 6: // 里程碑
                          return (
                            <div className="form-fields">
                              {proposal.milestones.length === 0 ? (
                                <div className="milestones-empty">
                                  <p>未添加任何里程碑</p>
                                </div>
                              ) : (
                                <div className="proposal-milestones">
                                  {proposal.milestones.map((milestone, milestoneIndex) => (
                                    <div key={milestone.id} className="proposal-milestone">
                                      <h4>里程碑 {milestoneIndex + 1}: {milestone.title || "未命名"}</h4>
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
                          );

                        default:
                          return null;
                      }
                    })()}
                  </div>
                </div>
              ))}
            </div>

            {/* 右侧时间线 */}
            <div className="proposal-sidebar">
              <div className="timeline-card">
                <h3 className="timeline-title">提案时间线</h3>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-event">第二次社区质询会</div>
                      <div className="timeline-date">2025/09/08 16:30 (UTC+08:00)</div>
                    </div>
                    <div className="timeline-link">
                      <AiOutlineExport size={14} />
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-event">第一次社区质询会</div>
                      <div className="timeline-date">2025/09/01 16:30 (UTC+08:00)</div>
                    </div>
                    <div className="timeline-link">
                      <span className="timeline-icon">📄</span>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-event">提案发布</div>
                      <div className="timeline-date">2025/08/21 16:30 (UTC+08:00)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
