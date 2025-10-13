"use client";

import React from "react";
import Image from "next/image";
// import { MdOutlineDelete } from "react-icons/md";

import "./comment.css";
import { CommentReplyProps } from "@/types/comment";

export default function CommentReply({ 
  comment, 
  onDelete // 暂时屏蔽
}: CommentReplyProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unusedDelete = onDelete;
  
  // 暂时屏蔽删除功能
  /* const handleDelete = () => {
    if (window.confirm("确定要删除这条评论吗？")) {
      onDelete(comment.id);
    }
  }; */

  // 格式化时间
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "刚刚";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
    return date.toLocaleDateString("zh-CN");
  };

  // 判断是否为回复评论
  const isReplyToComment = comment.to && comment.to.did;
  const replyToName = isReplyToComment 
    ? (comment.to?.displayName || comment.to?.handle || comment.to?.did)
    : null;

  return (
    <div className="comment-reply-item">
      <div className="comment-reply-content">
        <div className="comment-reply-header">
          <h4>
          
            {isReplyToComment && replyToName && (
              <span className="reply-to-indicator">
              
                <Image 
                  src={"/avatar.jpg"} 
                  alt="reply to avatar" 
                  width={20} 
                  height={20}
                  style={{ 
                    display: 'inline-block', 
                    borderRadius: '50%',
                    verticalAlign: 'middle',
                    marginLeft: '4px',
                    marginRight: '4px'
                  }}
                />
                <span className="reply-to-name">{replyToName}</span>
              </span>
            )}
            {/* <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span> */}
          </h4>
          {/* 暂时屏蔽删除功能 */}
          {/* {comment.isAuthor && (
            <div className="comment-reply-actions">
              <button onClick={handleDelete} className="comment-reply-action-btn">
                <MdOutlineDelete />
              </button>
            </div>
          )} */}
        </div>
        <div className="comment-reply-text">
          <div 
            dangerouslySetInnerHTML={{ __html: comment.content }}
            className="comment-content-html"
          />
        </div>
      </div>
    </div>
  );
}