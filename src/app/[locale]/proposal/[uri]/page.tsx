"use client";

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { useTranslation } from "../../../../utils/i18n";
import { FaHeart, FaShare } from "react-icons/fa";
import Image from "next/image";
import { RingLoader } from "react-spinners";
import CopyButton from "@/components/ui/copy/CopyButton";
import "../proposal.css";
import { IoDocumentTextOutline } from "react-icons/io5";
import { AiOutlineComment } from "react-icons/ai";
import Tag from "@/components/ui/tag/Tag";
import { getStatusTagClass } from "@/utils/proposalUtils";
import CommentSection from "@/components/comment/CommentSection";
import QuoteButton from "@/components/comment/QuoteButton";
import { Comment } from "@/types/comment";
import { TimelineEvent } from "@/types/timeline";
import { VotingInfo, VoteOption } from "@/types/voting";
import { ProposalTimeline, ProposalVoting, MilestoneTracking } from "@/components/proposal-phase";
import { generateTimelineEvents } from "@/utils/timelineUtils";
import { generateVotingInfo, handleVote } from "@/utils/votingUtils";
import { generateMilestones } from "@/utils/milestoneUtils";
import { generateMilestoneVotingInfo, handleMilestoneVote } from "@/utils/milestoneVotingUtils";
import { Milestone } from "@/types/milestone";
import { MilestoneVotingInfo, MilestoneVoteOption } from "@/types/milestoneVoting";
import { useProposalDetail } from "@/hooks/useProposalDetail";
import { ProposalDetailResponse } from "@/server/proposal";
import { Proposal, ProposalStatus, ProposalType, getStatusText } from "@/utils/proposalUtils";
import { writesPDSOperation } from "@/app/posts/utils";
import useUserInfoStore from "@/store/userInfo";
import { useCommentList } from "@/hooks/useCommentList";
import { CommentItem } from "@/server/comment";

// 适配器函数：将API返回的ProposalDetailResponse转换为工具函数期望的Proposal类型
const adaptProposalDetail = (detail: ProposalDetailResponse): Proposal => {
  // 从 record.data 中提取实际的提案数据
  const proposalData = detail.record.data;

  // 计算里程碑信息（如果有的话）
  const milestonesInfo = proposalData.milestones && proposalData.milestones.length > 0 ? {
    current: 1, // 默认为第一个里程碑
    total: proposalData.milestones.length,
    progress: 0, // 默认进度为0
  } : undefined;
  
  return {
    id: detail.cid, // 使用 cid 作为 id
    title: proposalData.title,
    state: proposalData.state, // 默认状态，可以根据实际情况调整
    type: proposalData.proposalType as ProposalType,
    proposer: {
      name: detail.author.displayName,
      avatar: '/avatar.jpg', // API 中没有 avatar，使用默认值
      did: detail.author.did,
    },
    budget: parseFloat(proposalData.budget) || 0,
    createdAt: detail.record.created,
    description: proposalData.background || '',
    milestones: milestonesInfo,
    category: proposalData.proposalType,
    tags: [],
  };
};

// 适配器函数：将API返回的CommentItem转换为组件需要的Comment类型
const adaptCommentItem = (item: CommentItem, currentUserDid?: string): Comment => {
  
  return {
    id: item.cid,
    content: item.text, // 使用 text 字段，不是 record.content
    author: {
      id: item.author.did,
      name: item.author.displayName || item.author.handle || item.author.did,
      avatar: item.author.avatar || "/avatar.jpg",
      did: item.author.did,
    },
    createdAt: item.created, // 直接使用 created，不是 record.created
    likes: parseInt(item.like_count) || 0, // like_count 是字符串，需要转换为数字
    parentId: item.parent_uri || undefined, // 使用 parent_uri 而不是 parent_id
    isLiked: item.liked || false,
    isAuthor: currentUserDid === item.author.did,
    to: item.to, // 直接传递 to 信息
  };
};

const steps = [
  { id: 2, name: "项目背景", description: "项目背景介绍" },
  { id: 3, name: "项目目标", description: "项目目标规划" },
  { id: 4, name: "团队介绍", description: "团队信息介绍" },
  { id: 5, name: "项目预算", description: "预算规划设置" },
  { id: 6, name: "里程碑", description: "项目里程碑规划" },
];

export default function ProposalDetail() {
  useTranslation();
  const params = useParams();
  const uri = params?.uri as string;
  const { userInfo, userProfile } = useUserInfoStore();

  // 使用真实API接口获取提案详情
  const { proposal, loading, error } = useProposalDetail(uri);
  
  // 使用真实API接口获取评论列表
  const { 
    comments: apiComments, 
    loading: commentsLoading, 
    error: commentsError, 
    refetch: refetchComments 
  } = useCommentList(proposal?.uri || null);
  
  // 调试：打印评论列表状态
  useEffect(() => {
    console.log('评论列表状态:', {
      loading: commentsLoading,
      error: commentsError,
      count: apiComments?.length || 0
    });
  }, [commentsLoading, commentsError, apiComments]);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [quotedText, setQuotedText] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null); // 保存被回复的评论 ID
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [votingInfo, setVotingInfo] = useState<VotingInfo | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestoneVotingInfo, setMilestoneVotingInfo] = useState<MilestoneVotingInfo | null>(null);
  // 点赞相关状态
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

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

  // 处理 API 返回的评论数据，转换为平铺的列表结构
  useEffect(() => {
    if (!apiComments || apiComments.length === 0) {
      setComments([]);
      return;
    }

    console.log('原始评论数据:', apiComments);

    // 转换评论数据为平铺列表
    const adaptedComments = apiComments.map(item => 
      adaptCommentItem(item, userInfo?.did)
    );

    console.log('转换后的评论数据（平铺列表）:', adaptedComments);

    // 智能合并：保留已存在评论的状态，只更新变化的部分
    setComments(prevComments => {
      const commentMap = new Map(prevComments.map(c => [c.id, c]));
      
      // 合并新旧评论，保留旧评论的UI状态
      const mergedComments = adaptedComments.map(newComment => {
        const existingComment = commentMap.get(newComment.id);
        if (existingComment) {
          // 保留现有评论，但更新可能变化的字段（如点赞数）
          return {
            ...existingComment,
            likes: newComment.likes,
            isLiked: newComment.isLiked,
          };
        }
        return newComment;
      });
      
      // 按时间倒序排列
      return mergedComments.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    });
  }, [apiComments, userInfo?.did]);

  // 当提案数据加载完成后，生成相关数据
  useEffect(() => {
    if (!proposal) return;
    
    // 初始化点赞数量
    setLikeCount(parseInt(proposal.like_count) || 0);
    
    // 将API返回的数据转换为工具函数期望的格式
    const adaptedProposal = adaptProposalDetail(proposal);

    // 生成时间线事件
    const events = generateTimelineEvents(adaptedProposal);
    setTimelineEvents(events);
    
    // 如果是投票阶段，生成投票信息
    if (adaptedProposal.state === ProposalStatus.VOTE) {
      const voting = generateVotingInfo(adaptedProposal);
      setVotingInfo(voting);
    }
    
    // 如果是执行阶段，生成里程碑信息
    if (adaptedProposal.state === ProposalStatus.MILESTONE || 
        adaptedProposal.state === ProposalStatus.APPROVED || 
        adaptedProposal.state === ProposalStatus.ENDED) {
      const milestoneData = generateMilestones(adaptedProposal);
      setMilestones(milestoneData);
      
      // 如果是里程碑阶段，生成里程碑投票信息
      if (adaptedProposal.state === ProposalStatus.MILESTONE && adaptedProposal.milestones) {
        const currentMilestoneId = `${adaptedProposal.id}-milestone-${adaptedProposal.milestones.current}`;
        const milestoneVoting = generateMilestoneVotingInfo(adaptedProposal, currentMilestoneId);
        setMilestoneVotingInfo(milestoneVoting);
      }
    }
  }, [proposal]);
  //点赞
  const handleLike = async() => {
    if (!proposal?.uri || !userInfo?.did) {
      return;
    }
    
    // 如果已经点赞或正在点赞，不再重复操作
    if (isLiked || isLiking) {
      return;
    }
    
    // 设置 loading 状态
    setIsLiking(true);
    
    try {
      // 调用 writesPDSOperation 点赞到 PDS
      const result = await writesPDSOperation({
        record: {
          $type: 'app.dao.like',
          to: proposal?.uri,
          viewer: userInfo?.did,
        },
        did: userInfo?.did ,
      });
      
      console.log(result);
      
      // 如果操作成功，更新状态
      if (result) {
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('点赞失败:', error);
    } finally {
      // 无论成功还是失败，都要取消 loading 状态
      setIsLiking(false);
    }
  };
  // 评论处理函数
  const handleAddComment = async (content: string, parentId?: string) => {
    if (!proposal?.uri || !userInfo?.did) {
      console.error('缺少必要的参数：proposal.uri 或 userInfo.did');
      return;
    }

    try {
      // 准备评论记录
      const record: {
        $type: 'app.dao.reply';
        proposal: string;
        text: string;
        parent?: string;
        to?: string;
      } = {
        $type: 'app.dao.reply',
        proposal: proposal.uri,
        text: content,
      };

      // 优先使用 replyToCommentId（从回复按钮设置的），否则使用 parentId 参数
      const targetCommentId = replyToCommentId || parentId;
      
      // 如果是回复评论，需要找到父评论的 URI 和作者 did
      if (targetCommentId) {
        // targetCommentId 可能是 cid，需要从 apiComments 中找到对应的 uri
        const parentComment = apiComments.find(c => c.cid === targetCommentId || c.uri === targetCommentId);
        if (parentComment) {
          record.parent = parentComment.uri; // 使用父评论的 uri
          if (parentComment.author?.did) {
            record.to = parentComment.author.did; // 回复对象的 did
          }
          console.log('回复评论:', { 
            commentId: targetCommentId,
            parent: record.parent, 
            to: record.to,
            authorName: parentComment.author?.displayName || parentComment.author?.handle 
          });
        } else {
          console.warn('找不到被回复的评论:', targetCommentId);
        }
      }

      // 调用 writesPDSOperation 发布评论到 PDS
      const result = await writesPDSOperation({
        record,
        did: userInfo.did,
      });

      console.log('评论发布结果:', result);

      // 如果操作成功，乐观添加到列表
      if (result) {
        // 乐观添加新评论到列表顶部
        const newComment: Comment = {
          id: result.cid || `temp-${Date.now()}`, // 使用返回的 cid 或临时 ID
          content: content,
          author: {
            id: userInfo.did,
            name: userProfile?.displayName || userInfo.handle || userInfo.did,
            avatar: "/avatar.jpg", // 使用默认头像
            did: userInfo.did,
          },
          createdAt: new Date().toISOString(),
          likes: 0,
          isLiked: false,
          isAuthor: true,
          parentId: record.parent,
          to: targetCommentId ? apiComments.find(c => c.cid === targetCommentId || c.uri === targetCommentId)?.to : undefined,
        };
        
        setComments(prev => [newComment, ...prev]);
        
        // 清除引用文本和回复目标
        setQuotedText("");
        setReplyToCommentId(null);
        console.log('评论发布成功，已添加到列表');
        
        // 后台静默刷新，确保数据同步（延迟刷新避免闪烁）
        setTimeout(() => {
          refetchComments();
        }, 1000);
      }
    } catch (error) {
      console.error('发布评论失败:', error);
      // 可以在这里添加错误提示
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!userInfo?.did) {
      console.error('用户未登录');
      return;
    }

    // 从 apiComments 中找到对应的评论获取 uri
    const targetComment = apiComments.find(c => c.cid === commentId);
    if (!targetComment) {
      console.error('找不到评论:', commentId);
      return;
    }

    // 如果已经点赞，不处理（或者可以实现取消点赞）
    if (targetComment.liked) {
      console.log('已经点赞过该评论');
      return;
    }

    try {
      // 乐观更新：先更新 UI
      // 先乐观更新 UI（平铺列表无需递归）
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.likes + 1,
            isLiked: true
          };
        }
        return comment;
      }));

      // 调用 writesPDSOperation 点赞评论
      const result = await writesPDSOperation({
        record: {
          $type: 'app.dao.like',
          to: targetComment.uri, // 评论的 uri
          viewer: userInfo.did,  // 点赞者的 did
        },
        did: userInfo.did,
      });

      console.log('评论点赞结果:', result);

      // 点赞成功，保持乐观更新的状态即可，不需要刷新
      // 这样可以避免列表闪烁，提升用户体验
    } catch (error) {
      console.error('评论点赞失败:', error);
      
      // 失败时回滚 UI（平铺列表无需递归）
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.likes - 1,
            isLiked: false
          };
        }
        return comment;
      }));
    }
  };

  const handleReplyComment = (commentId: string, content: string) => {
    // 将评论内容作为引用填充到主评论框
    setQuotedText(content);
    // 保存被回复的评论 ID，用于提交时添加 to 参数
    setReplyToCommentId(commentId);
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

  const handleEditComment = (commentId: string, content: string) => {
    // 平铺列表无需递归，直接查找并更新
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          content,
          updatedAt: new Date().toISOString()
        };
      }
      return comment;
    }));
  };

  const handleDeleteComment = (commentId: string) => {
    // 平铺列表无需递归，直接过滤
    setComments(comments.filter(comment => comment.id !== commentId));
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

 
  const getProposalTypeText = (type: string) => {
    const types: { [key: string]: string } = {
      funding: "资金申请",
      governance: "治理提案",
      technical: "技术提案",
      community: "社区提案",
      development: "开发项目",
      ecosystem: "生态建设",
      research: "研究项目",
      infrastructure: "基础设施",
    };
    return types[type] || "未知类型";
  };


  if (loading) {
    return (
      <div className="container">
        <main>
          <div className="main-content">
            <div className="step-container">
              <div className="loading-state">
                <div className="loading-text">加载中...</div>
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
            <span>{proposal.record.data.title}</span>
          </div>

          <div className="proposal-content-wrapper">
            {/* 左侧主要内容 */}
            <div className="proposal-content-left">
              <div className="proposal-main-content">
                {/* 提案头部信息 */}
                <div className="proposal-header-card">
                  <div className="proposal-title-section">
                    <h1 className="proposal-main-title">{proposal.record.data.title}</h1>

                    <div className="proposal-author-info">
                      <div className="author-avatar">
                        <Image
                          src={'/avatar.jpg'}
                          alt="avatar"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="author-details">
                        <div className="author-name">
                          {proposal.author.displayName}
                        </div>
                        <div className="author-did">
                          {proposal.author.did}
                          <CopyButton
                            className="copy-btn"
                            text={proposal.author.did}
                            ariaLabel="copy-author-did"
                          >
                          
                          </CopyButton>
                         
                        </div>
                      </div>
                    </div>

                    <div className="proposal-meta-tags">
                      <span className="meta-tag date-tag">
                        {new Date(proposal.record.created).toLocaleDateString(
                          "zh-CN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                      <span className="meta-tag type-tag">
                        {getProposalTypeText(proposal.record.data.proposalType)}
                      </span>
                      <span className="meta-tag budget-tag">
                        {proposal.record.data.budget
                          ? `${Number(
                            proposal.record.data.budget
                            ).toLocaleString()}.000 CKB`
                          : "未设置预算"}
                      </span>
                      <Tag type="status" size="sm" className={`meta-tag ${getStatusTagClass(proposal.state)}`}>
                        {getStatusText(proposal.state)}
                      </Tag>
                    </div>

                    <div className="proposal-actions">
                      <a 
                        href="#proposal-detail"
                        className="action-btn secondary-btn"
                      >
                        <IoDocumentTextOutline />
                        提案详情
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
                                    __html: proposal.record.data.background || "未填写",
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
                                    __html: proposal.record.data.goals || "未填写",
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
                                    __html: proposal.record.data.team || "未填写",
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
                                    {proposal.record.data.budget
                                      ? `${Number(
                                        proposal.record.data.budget
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
                                  {proposal.record.data.milestones ? (
                                    <div className="milestone-summary">
                                      <p>当前里程碑: {proposal.state-1000} / {proposal.record.data.milestones.length}</p>
                                      <p>进度: {(proposal.state-1000)/proposal.record.data.milestones.length*100}%</p>
                                    </div>
                                  ) : (
                                    <p>暂无里程碑信息</p>
                                  )}
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
                <div className="proposal-like">
                    <a 
                      className={`button-actions ${isLiked ? 'liked' : ''} ${isLiking ? 'loading' : ''}`}
                      onClick={handleLike}
                      style={{ 
                        color: isLiked ? '#ff4d6d' : undefined,
                        cursor: isLiked || isLiking ? 'default' : 'pointer'
                      }}
                    >
                      {isLiking ? (
                        <>
                          <RingLoader size={16} color={isLiked ? '#ff4d6d' : '#ffffff'} />
                          <span style={{ marginLeft: '4px' }}>点赞中...</span>
                        </>
                      ) : (
                        <>
                          <FaHeart /> {likeCount}
                        </>
                      )}
                    </a>
                    <a className="button-actions">
                      <FaShare /> 分享
                    </a>
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
                  currentMilestone={proposal?.state-1000 || 1}
                  totalMilestones={proposal?.record.data.milestones?.length || 3}
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
