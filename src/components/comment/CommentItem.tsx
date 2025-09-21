"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdOutlineModeComment, MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { GrShareOption } from "react-icons/gr";
import dynamic from "next/dynamic";

import "./comment.css";
import { CommentItemProps } from "@/types/comment";
import CommentReply from "./CommentReply";

// 动态导入ReactQuill，禁用SSR
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "120px",
        marginBottom: "10px",
        border: "1px solid #4C525C",
        borderRadius: "6px",
        backgroundColor: "#262A33",
        padding: "12px",
        color: "#6b7280",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      编辑器加载中...
    </div>
  ),
});

export default function CommentItem({ 
  comment, 
  onLike, 
  onReply, 
  onEdit, 
  onDelete, 
  level = 0 
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isClient, setIsClient] = useState(false);

  // 检查是否在客户端
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  const handleLike = () => {
    onLike(comment.id);
  };

  const handleEdit = () => {
    const newContent = prompt("编辑评论:", comment.content);
    if (newContent && newContent !== comment.content) {
      onEdit(comment.id, newContent);
    }
  };

  const handleDelete = () => {
    if (window.confirm("确定要删除这条评论吗？")) {
      onDelete(comment.id);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["image", "code-block"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "image",
    "code-block",
  ];

  return (
    <div className={`comment-item ${level > 0 ? 'comment-reply' : ''}`} style={{ marginLeft: `${level * 20}px` }}>
      <div className="comment-item-avatar">
        <Image src={comment.author.avatar} alt="avatar" width={40} height={40} />
      </div>
      <div className="comment-item-container">
      <div className="comment-item-content">
        <div className="comment-item-header">
          <h3>
            {comment.author.name}
            <span>{formatTimeAgo(comment.createdAt)}</span>
          </h3>
          {comment.isAuthor && (
            <div className="comment-actions">
              <button onClick={handleEdit} className="comment-action-btn">
                <MdOutlineEdit />
              </button>
              <button onClick={handleDelete} className="comment-action-btn">
                <MdOutlineDelete />
              </button>
            </div>
          )}
        </div>

        {/* 回复列表 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            {comment.replies.map((reply) => (
              <CommentReply
                key={reply.id}
                comment={reply}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
        <div className="comment-item-text">
          <div 
            dangerouslySetInnerHTML={{ __html: comment.content }}
            className="comment-content-html"
          />
        </div>
       
        {/* 回复输入框 */}
        {isReplying && (
          <div className="comment-reply-form">
            <div className="comment-reply-editor">
              {isClient ? (
                <div className="quill-wrapper">
                  <ReactQuill
                    theme="snow"
                    value={replyContent}
                    onChange={setReplyContent}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="写下你的回复..."
                    style={{
                      height: "120px",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    height: "120px",
                    border: "1px solid #4C525C",
                    borderRadius: "6px",
                    backgroundColor: "#262A33",
                    padding: "12px",
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  编辑器加载中...
                </div>
              )}
            </div>
            <div className="comment-reply-actions">
              <button onClick={handleReply} className="comment-reply-submit">
                回复
              </button>
              <button 
                onClick={() => setIsReplying(false)} 
                className="comment-reply-cancel"
              >
                取消
              </button>
            </div>
          </div>
        )}

      </div>
      <div className="comment-item-footer">
        <button 
            onClick={() => setIsReplying(!isReplying)} 
            className="comment-footer-button"
          >
            <MdOutlineModeComment />
            回复
          </button>
          <button 
            onClick={handleLike} 
            className={`comment-footer-button ${comment.isLiked ? 'liked' : ''}`}
          >
            {comment.isLiked ? <FaHeart /> : <FaRegHeart />}
            {comment.likes > 0 && <span>{comment.likes}</span>}
          </button>
         
          <button 
          
            className="comment-footer-button"
          >
            <GrShareOption />
            分享
          </button>
        </div>
        </div>
    </div>
  );
}
