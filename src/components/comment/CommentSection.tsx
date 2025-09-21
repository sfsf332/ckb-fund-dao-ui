"use client";

import React from "react";

import "./comment.css";
import CommentItem from "./CommentItem";
import CommentQuote from "./CommentQuote";
import { CommentSectionProps } from "@/types/comment";

export default function CommentSection({ 
  comments = [], 
  onAddComment, 
  onLikeComment, 
  onReplyComment, 
  onEditComment, 
  onDeleteComment,
  loading = false,
  error,
  quotedText = ""
}: CommentSectionProps) {
  console.log('CommentSection rendered with quotedText:', quotedText);
  const handleAddComment = (content: string, parentId?: string) => {
    onAddComment(content, parentId);
  };

  const handleLikeComment = (commentId: string) => {
    onLikeComment(commentId);
  };

  const handleReplyComment = (commentId: string, content: string) => {
    onReplyComment(commentId, content);
  };

  const handleEditComment = (commentId: string, content: string) => {
    onEditComment(commentId, content);
  };

  const handleDeleteComment = (commentId: string) => {
    onDeleteComment(commentId);
  };


  if (loading) {
    return (
      <div className="comment-section">
        <div className="comment-header">
          <h3 className="comment-title">加载中...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comment-section">
        <div className="comment-header">
          <h3 className="comment-title">加载评论失败: {error}</h3>
        </div>
      </div>
    );
  }

  return (
     <div className="comment-section">
        <div className="comment-header">
          <h3 className="comment-title">{comments.length}条评论</h3>
        </div>
        <div className="comment-content">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={handleLikeComment}
              onReply={handleReplyComment}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
        <div className="comment-quote-section">
          <CommentQuote 
            onSubmit={handleAddComment}
            placeholder="请填写评论"
            quotedText={quotedText}
          />
        </div>
     </div>
    
  );
}
