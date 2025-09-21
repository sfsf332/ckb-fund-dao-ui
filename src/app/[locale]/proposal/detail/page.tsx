"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "../../../../utils/i18n";
import { FaCopy } from "react-icons/fa";
import { AiOutlineExport } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";
import { handleCopy } from "@/utils/common";
import "../create/create-proposal.css";
import { IoDocumentTextOutline } from "react-icons/io5";
import { AiOutlineComment } from "react-icons/ai";
import CommentSection from "@/components/comment/CommentSection";
import QuoteButton from "@/components/comment/QuoteButton";
import { Comment } from "@/types/comment";
import { TimelineEvent } from "@/types/timeline";
import { VotingInfo, VoteOption } from "@/types/voting";
import { mockProposals } from "@/data/mockProposals";
import { ProposalTimeline, ProposalVoting, MilestoneTracking, MilestoneVoting } from "@/components/proposal-phase";
import { generateTimelineEvents } from "@/utils/timelineUtils";
import { generateVotingInfo, handleVote } from "@/utils/votingUtils";
import { generateMilestones } from "@/utils/milestoneUtils";
import { generateMilestoneVotingInfo, handleMilestoneVote } from "@/utils/milestoneVotingUtils";
import { Milestone } from "@/types/milestone";
import { MilestoneVotingInfo, MilestoneVoteOption } from "@/types/milestoneVoting";


interface Proposal {
  id: string;
  proposalType: string;
  title: string;
  releaseDate: string;
  background: string;
  goals: string;
  team: string;
  budget: string;
  milestones: {
    current: number;
    total: number;
    progress: number;
  };
  status: string;
  createdAt: string;
  author: {
    name: string;
    did: string;
    avatar: string;
  };
}

const steps = [
  { id: 2, name: "项目背景", description: "项目背景介绍" },
  { id: 3, name: "项目目标", description: "项目目标规划" },
  { id: 4, name: "团队介绍", description: "团队信息介绍" },
  { id: 5, name: "项目预算", description: "预算规划设置" },
  { id: 6, name: "里程碑", description: "项目里程碑规划" },
];

export default function ProposalDetail() {
  useTranslation();
  const searchParams = useSearchParams();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading] = useState(false);
  const [commentsError] = useState("");
  const [quotedText, setQuotedText] = useState("");
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [votingInfo, setVotingInfo] = useState<VotingInfo | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestoneVotingInfo, setMilestoneVotingInfo] = useState<MilestoneVotingInfo | null>(null);

  useEffect(() => {
    // 处理锚点高亮
    const handleHashChange = () => {
      const hash = window.location.hash;
      const buttons = document.querySelectorAll('.proposal-actions a');
      
      buttons.forEach(button => {
        button.classList.remove('primary-btn');
        button.classList.add('secondary-btn');
      });
      
      if (hash === '#proposal-detail') {
        const detailButton = document.querySelector('a[href="#proposal-detail"]');
        if (detailButton) {
          detailButton.classList.remove('secondary-btn');
          detailButton.classList.add('primary-btn');
        }
      } else if (hash === '#comment-section') {
        const commentButton = document.querySelector('a[href="#comment-section"]');
        if (commentButton) {
          commentButton.classList.remove('secondary-btn');
          commentButton.classList.add('primary-btn');
        }
      }
    };

    // 初始设置
    if (!window.location.hash) {
      window.location.hash = '#proposal-detail';
    }
    handleHashChange();
    
    // 监听hash变化
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    // Mock评论数据
    const mockComments: Comment[] = [
      {
        id: "1",
        content: "Hi telmobit, in the CKB Community Fund DAO Rules and Process, it is written that the proposal requires to 'allow sufficient time (one week) to help the community fully understand the proposal's content and budget and enough time to allow the community to discuss and give the proposer suggestions and comments for changes.' This proposal was submitted to Nervos. About the budget, you have agreed in your reply to Jordan that the budget will decrease to $4500, but in this proposal, the amount is still $7500. So, I suggest you invalidate this vote on Metaforo as it violates the rules of the DAO.",
        author: {
          id: "user1",
          name: "Altruistic",
          avatar: "/avatar.jpg",
          did: "did:ckb:1234567890"
        },
        createdAt: "2025-01-15T10:30:00Z",
        likes: 12,
        replies: [
          {
            id: "1-1",
            content: "感谢您的提醒，我会尽快更新预算信息。",
            author: {
              id: "user2",
              name: "telmobit",
              avatar: "/avatar.jpg",
              did: "did:ckb:0987654321"
            },
            createdAt: "2025-01-15T14:20:00Z",
            likes: 3,
            replies: [],
            parentId: "1",
            isLiked: false,
            isAuthor: false
          }
        ],
        isLiked: true,
        isAuthor: false
      },
      {
        id: "2",
        content: "这个提案很有前景，我支持！希望团队能够按时完成里程碑。",
        author: {
          id: "user3",
          name: "CKB_Supporter",
          avatar: "/avatar.jpg",
          did: "did:ckb:1122334455"
        },
        createdAt: "2025-01-14T16:45:00Z",
        likes: 8,
        replies: [],
        isLiked: false,
        isAuthor: false
      },
      {
        id: "3",
        content: "关于技术集成的部分，我想了解更多关于与RGB++协议兼容的细节。",
        author: {
          id: "user4",
          name: "TechReviewer",
          avatar: "/avatar.jpg",
          did: "did:ckb:5566778899"
        },
        createdAt: "2025-01-14T09:15:00Z",
        likes: 5,
        replies: [
          {
            id: "3-1",
            content: "我们计划在第二阶段详细说明技术集成方案，包括与RGB++的兼容性设计。",
            author: {
              id: "user5",
              name: "ZenGate_Team",
              avatar: "/avatar.jpg",
              did: "did:ckb:9988776655"
            },
            createdAt: "2025-01-14T11:30:00Z",
            likes: 2,
            replies: [],
            parentId: "3",
            isLiked: false,
            isAuthor: true
          }
        ],
        isLiked: false,
        isAuthor: false
      }
    ];

    // 从 URL 参数获取提案 ID，并从 mock 数据中加载对应提案
    const loadProposal = async () => {
      try {
        setLoading(true);
        const proposalId = searchParams.get('id');
        
        if (!proposalId) {
          setError("未找到提案 ID");
          return;
        }

        // 从 mock 数据中查找对应的提案
        const foundProposal = mockProposals.find(p => p.id === proposalId);
        
        if (!foundProposal) {
          setError("提案不存在");
          return;
        }

        // 模拟数据加载延迟
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // 将 mock 数据转换为详情页需要的格式
        const proposalData: Proposal = {
          id: foundProposal.id,
          proposalType: foundProposal.type === 'development' ? 'technical' : 
                       foundProposal.type === 'governance' ? 'governance' : 'community',
          title: foundProposal.title,
          releaseDate: foundProposal.createdAt,
          background: `<p>${foundProposal.description}</p>`,
          goals: `<p>这是一个关于 ${foundProposal.title} 的项目提案。该项目旨在为 Nervos 生态系统做出贡献。</p>`,
          team: `<p>提案人：${foundProposal.proposer.name}</p><p>DID：${foundProposal.proposer.did}</p>`,
          budget: foundProposal.budget.toString(),
          milestones: foundProposal.milestones || {
            current: 1,
            total: 3,
            progress: 0
          },
          status: foundProposal.status === 'vote' ? 'active' : 
                 foundProposal.status === 'ended' ? 'completed' : 'pending',
          createdAt: foundProposal.createdAt,
          author: {
            name: foundProposal.proposer.name,
            did: foundProposal.proposer.did,
            avatar: foundProposal.proposer.avatar,
          },
        };
        
        setProposal(proposalData);
        
        // 生成时间线事件
        const events = generateTimelineEvents(foundProposal);
        setTimelineEvents(events);
        
        // 如果是投票阶段，生成投票信息
        if (foundProposal.status === 'vote') {
          const voting = generateVotingInfo(foundProposal);
          setVotingInfo(voting);
        }
        
        // 如果是执行阶段，生成里程碑信息
        if (foundProposal.status === 'milestone' || foundProposal.status === 'approved' || foundProposal.status === 'ended') {
          const milestoneData = generateMilestones(foundProposal);
          setMilestones(milestoneData);
          
          // 如果是里程碑阶段，生成里程碑投票信息
          if (foundProposal.status === 'milestone' && foundProposal.milestones) {
            const currentMilestoneId = `${foundProposal.id}-milestone-${foundProposal.milestones.current}`;
            const milestoneVoting = generateMilestoneVotingInfo(foundProposal, currentMilestoneId);
            setMilestoneVotingInfo(milestoneVoting);
          }
        }
      } catch (err) {
        setError("加载提案失败");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProposal();
    // 初始化评论数据
    setComments(mockComments);
  }, [searchParams]);

  // 评论处理函数
  const handleAddComment = (content: string, parentId?: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      author: {
        id: "current_user",
        name: "当前用户",
        avatar: "/avatar.jpg",
        did: "did:ckb:current_user"
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
      parentId,
      isLiked: false,
      isAuthor: true
    };

    if (parentId) {
      // 添加回复
      const addReplyToComment = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, newComment]
            };
          }
          if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplyToComment(comment.replies)
            };
          }
          return comment;
        });
      };
      setComments(addReplyToComment(comments));
    } else {
      // 添加新评论
      setComments([...comments, newComment]);
    }
  };

  const handleLikeComment = (commentId: string) => {
    const toggleLike = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          };
        }
        if (comment.replies.length > 0) {
          return {
            ...comment,
            replies: toggleLike(comment.replies)
          };
        }
        return comment;
      });
    };
    setComments(toggleLike(comments));
  };

  const handleReplyComment = (commentId: string, content: string) => {
    handleAddComment(content, commentId);
  };

  const handleEditComment = (commentId: string, content: string) => {
    const editComment = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            content,
            updatedAt: new Date().toISOString()
          };
        }
        if (comment.replies.length > 0) {
          return {
            ...comment,
            replies: editComment(comment.replies)
          };
        }
        return comment;
      });
    };
    setComments(editComment(comments));
  };

  const handleDeleteComment = (commentId: string) => {
    const deleteComment = (comments: Comment[]): Comment[] => {
      return comments.filter(comment => {
        if (comment.id === commentId) {
          return false;
        }
        if (comment.replies.length > 0) {
          comment.replies = deleteComment(comment.replies);
        }
        return true;
      });
    };
    setComments(deleteComment(comments));
  };

  const handleQuote = (selectedText: string) => {
    // 设置引用文本
    setQuotedText(selectedText);
    // 跳转到评论区域
    window.location.hash = '#comment-section';
    // 滚动到评论区域
    setTimeout(() => {
      const commentSection = document.getElementById('comment-section');
      if (commentSection) {
        commentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // 处理投票
  const handleVoteSubmit = async (option: VoteOption) => {
    if (!votingInfo) return;
    
    try {
      const success = await handleVote(votingInfo.proposalId, option);
      if (success) {
        // 更新投票信息
        setVotingInfo(prev => prev ? {
          ...prev,
          userVote: option,
          totalVotes: prev.totalVotes + prev.userVotingPower,
          approveVotes: option === VoteOption.APPROVE 
            ? prev.approveVotes + prev.userVotingPower 
            : prev.approveVotes,
          rejectVotes: option === VoteOption.REJECT 
            ? prev.rejectVotes + prev.userVotingPower 
            : prev.rejectVotes,
          conditions: {
            ...prev.conditions,
            currentTotalVotes: prev.totalVotes + prev.userVotingPower,
            currentApprovalRate: option === VoteOption.APPROVE 
              ? ((prev.approveVotes + prev.userVotingPower) / (prev.totalVotes + prev.userVotingPower)) * 100
              : (prev.approveVotes / (prev.totalVotes + prev.userVotingPower)) * 100
          }
        } : null);
      }
    } catch (error) {
      console.error('投票失败:', error);
    }
  };

  // 处理里程碑投票提交
  const handleMilestoneVoteSubmit = (milestoneId: string, option: MilestoneVoteOption) => {
    if (!milestoneVotingInfo) return;
    
    const updatedVoting = handleMilestoneVote(milestoneVotingInfo, option);
    setMilestoneVotingInfo(updatedVoting);
  };

  const getProposalTypeText = (type: string) => {
    const types: { [key: string]: string } = {
      funding: "资金申请",
      governance: "治理提案",
      technical: "技术提案",
      community: "社区提案",
    };
    return types[type] || "未知类型";
  };

  const getStatusText = (status: string) => {
    const statuses: { [key: string]: string } = {
      active: "进行中",
      completed: "已完成",
      cancelled: "已取消",
      pending: "待审核",
    };
    return statuses[status] || "未知状态";
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
            <div className="proposal-content-left">
              <div className="proposal-main-content">
                {/* 提案头部信息 */}
                <div className="proposal-header-card">
                  <div className="proposal-title-section">
                    <h1 className="proposal-main-title">{proposal.title}</h1>

                    <div className="proposal-author-info">
                      <div className="author-avatar">
                        <Image
                          src={proposal.author.avatar}
                          alt="avatar"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="author-details">
                        <div className="author-name">
                          {proposal.author.name}
                        </div>
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
                        {new Date(proposal.createdAt).toLocaleDateString(
                          "zh-CN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                      <span className="meta-tag type-tag">
                        {getProposalTypeText(proposal.proposalType)}
                      </span>
                      <span className="meta-tag budget-tag">
                        {proposal.budget
                          ? `${Number(
                              proposal.budget
                            ).toLocaleString()}.000 CKB`
                          : "未设置预算"}
                      </span>
                      <span className="meta-tag status-tag">
                        {getStatusText(proposal.status)}
                      </span>
                    </div>

                    <div className="proposal-actions">
                      <a 
                        href="#proposal-detail"
                        className="action-btn secondary-btn"
                      >
                        <IoDocumentTextOutline />
                        提案详细
                      </a>
                      <a 
                        href="#comment-section"
                        className="action-btn secondary-btn"
                      >
                        <AiOutlineComment />
                        社区讨论 ({comments.length})
                      </a>
                    </div>
                  </div>
                </div>
                <div id="proposal-detail" className="proposal-detail">
                <QuoteButton onQuote={handleQuote} />
                {/* 所有步骤内容按顺序展示 */}
                {steps.map((step) => (
                  <div key={step.id} className="proposal-step-content">
                    <div className="step-title-container">
                      <h2 className="step-title">{step.name} </h2>
                    </div>

                    <div className="step-content">
                      {(() => {
                        switch (step.id) {
                          case 2: // 项目背景
                            return (
                              <div className="form-fields">
                                <div
                                  className="proposal-html-content"
                                  dangerouslySetInnerHTML={{
                                    __html: proposal.background || "未填写",
                                  }}
                                />
                              </div>
                            );

                          case 3: // 项目目标
                            return (
                              <div className="form-fields">
                                <div
                                  className="proposal-html-content"
                                  dangerouslySetInnerHTML={{
                                    __html: proposal.goals || "未填写",
                                  }}
                                />
                              </div>
                            );

                          case 4: // 团队介绍
                            return (
                              <div className="form-fields">
                                <div
                                  className="proposal-html-content"
                                  dangerouslySetInnerHTML={{
                                    __html: proposal.team || "未填写",
                                  }}
                                />
                              </div>
                            );

                          case 5: // 项目预算
                            return (
                              <div className="form-fields">
                                <div className="proposal-field">
                                  <label className="form-label">
                                    预算金额 (CKB):
                                  </label>
                                  <span className="proposal-value">
                                    {proposal.budget
                                      ? `${Number(
                                          proposal.budget
                                        ).toLocaleString()}.000 CKB`
                                      : "未填写"}
                                  </span>
                                </div>
                              </div>
                            );

                          case 6: // 里程碑
                            return (
                              <div className="form-fields">
                                <div className="proposal-milestones">
                                  <div className="milestone-summary">
                                    <p>当前里程碑: {proposal.milestones.current} / {proposal.milestones.total}</p>
                                    <p>进度: {proposal.milestones.progress}%</p>
                                  </div>
                                </div>
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
                <div id="comment-section">
                  <CommentSection
                    comments={comments}
                    onAddComment={handleAddComment}
                    onLikeComment={handleLikeComment}
                    onReplyComment={handleReplyComment}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                    loading={commentsLoading}
                    error={commentsError}
                    quotedText={quotedText}
                  />
                </div>
              </div>
                
            </div>
            {/* 右侧时间线 */}
            <div className="proposal-sidebar">
              {/* 投票组件 - 仅在投票阶段显示 */}
              {votingInfo && (
                <ProposalVoting 
                  votingInfo={votingInfo}
                  onVote={handleVoteSubmit}
                />
              )}
              
              {/* 里程碑追踪组件 - 仅在执行阶段显示 */}
              {milestones.length > 0 && (
                <MilestoneTracking 
                  milestones={milestones}
                  currentMilestone={proposal?.milestones?.current || 1}
                  totalMilestones={proposal?.milestones?.total || 3}
                />
              )}
              
              <ProposalTimeline 
                events={timelineEvents} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
