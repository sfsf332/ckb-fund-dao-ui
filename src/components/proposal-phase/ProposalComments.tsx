"use client";

import { useState, useEffect } from "react";
import CommentSection from "@/components/comment/CommentSection";
import { Comment } from "@/types/comment";
import { CommentItem } from "@/server/comment";
import { writesPDSOperation } from "@/app/posts/utils";
import useUserInfoStore from "@/store/userInfo";
import { getAvatarByDid } from "@/utils/avatarUtils";
import { ProposalDetailResponse } from "@/server/proposal";
import { getUserDisplayNameFromInfo, getUserDisplayNameFromStore } from "@/utils/userDisplayUtils";

interface ProposalCommentsProps {
  proposal: ProposalDetailResponse | null;
  apiComments: CommentItem[];
  commentsLoading: boolean;
  commentsError?: string;
  onRefetchComments: () => void;
  quotedText?: string;
}

// 适配器函数：将API返回的CommentItem转换为组件需要的Comment类型
const adaptCommentItem = (item: CommentItem, currentUserDid?: string): Comment => {
  const displayName = getUserDisplayNameFromInfo({
    displayName: item.author.displayName,
    handle: item.author.handle,
    did: item.author.did,
  });
  
  // 格式化 to 字段的 handle（如果存在）
  const formattedTo = item.to ? {
    did: item.to.did,
    displayName: getUserDisplayNameFromInfo({
      displayName: item.to.displayName,
      handle: item.to.handle,
      did: item.to.did,
    }),
    handle: item.to.handle, // 保留原始 handle，但 displayName 优先
    avatar: item.to.avatar,
  } : undefined;
  
  return {
    id: item.cid,
    content: item.text,
    author: {
      id: item.author.did,
      name: displayName,
      avatar: item.author.avatar || getAvatarByDid(item.author.did),
      did: item.author.did,
    },
    createdAt: item.created,
    likes: parseInt(item.like_count) || 0,
    parentId: item.parent_uri || undefined,
    isLiked: item.liked || false,
    isAuthor: currentUserDid === item.author.did,
    to: formattedTo,
  };
};

export default function ProposalComments({ 
  proposal, 
  apiComments, 
  commentsLoading, 
  commentsError, 
  onRefetchComments,
  quotedText: externalQuotedText = "" 
}: ProposalCommentsProps) {
  const { userInfo, userProfile } = useUserInfoStore();
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [quotedText, setQuotedText] = useState(externalQuotedText);
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);

  // 当外部传入的 quotedText 变化时，更新内部状态
  useEffect(() => {
    if (externalQuotedText) {
      setQuotedText(externalQuotedText);
    }
  }, [externalQuotedText]);

  // 处理 API 返回的评论数据，转换为平铺的列表结构
  useEffect(() => {
    if (!apiComments || apiComments.length === 0) {
      setComments([]);
      return;
    }

    const adaptedComments = apiComments.map(item => 
      adaptCommentItem(item, userInfo?.did)
    );

    setComments(prevComments => {
      const commentMap = new Map(prevComments.map(c => [c.id, c]));
      
      const mergedComments = adaptedComments.map(newComment => {
        const existingComment = commentMap.get(newComment.id);
        if (existingComment) {
          return {
            ...existingComment,
            likes: newComment.likes,
            isLiked: newComment.isLiked,
          };
        }
        return newComment;
      });
      
      return mergedComments.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    });
  }, [apiComments, userInfo?.did]);

  // 评论处理函数
  const handleAddComment = async (content: string, parentId?: string) => {
    if (!proposal?.uri || !userInfo?.did) {
      console.error('缺少必要的参数：proposal.uri 或 userInfo.did');
      return;
    }

    try {
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

      const targetCommentId = replyToCommentId || parentId;
      
      if (targetCommentId) {
        const parentComment = apiComments?.find(c => c.cid === targetCommentId || c.uri === targetCommentId);
        if (parentComment) {
          record.parent = parentComment.uri;
          if (parentComment.author?.did) {
            record.to = parentComment.author.did;
          }
        }
      }

      const result = await writesPDSOperation({
        record,
        did: userInfo.did,
      });

      if (result) {
        const displayName = getUserDisplayNameFromStore(userInfo, userProfile);
        
        const newComment: Comment = {
          id: result.cid || `temp-${Date.now()}`,
          content: content,
          author: {
            id: userInfo.did,
            name: displayName,
            avatar: getAvatarByDid(userInfo.did),
            did: userInfo.did,
          },
          createdAt: new Date().toISOString(),
          likes: 0,
          isLiked: false,
          isAuthor: true,
          parentId: record.parent,
          to: targetCommentId ? apiComments?.find(c => c.cid === targetCommentId || c.uri === targetCommentId)?.to : undefined,
        };
        
        setComments(prev => [newComment, ...prev]);
        setQuotedText("");
        setReplyToCommentId(null);
        
        setTimeout(() => {
          onRefetchComments();
        }, 1000);
      }
    } catch (error) {
      console.error('发布评论失败:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!userInfo?.did) {
      console.error('用户未登录');
      return;
    }

    const targetComment = apiComments?.find(c => c.cid === commentId);
    if (!targetComment) {
      console.error('找不到评论:', commentId);
      return;
    }

    if (targetComment.liked) {
      console.log('已经点赞过该评论');
      return;
    }

    try {
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

      await writesPDSOperation({
        record: {
          $type: 'app.dao.like',
          to: targetComment.uri,
          viewer: userInfo.did,
        },
        did: userInfo.did,
      });
    } catch (error) {
      console.error('评论点赞失败:', error);
      
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
    setQuotedText(content);
    setReplyToCommentId(commentId);
    window.location.hash = '#comment-section';
    setTimeout(() => {
      const commentSection = document.getElementById('comment-section');
      if (commentSection) {
        commentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleEditComment = (commentId: string, content: string) => {
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
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  return (
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
  );
}
