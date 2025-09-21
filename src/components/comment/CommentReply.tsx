"use client";

import React from "react";
import Image from "next/image";
import { MdOutlineDelete } from "react-icons/md";

import "./comment.css";
import { CommentReplyProps } from "@/types/comment";

export default function CommentReply({ 
  comment, 
  onDelete
}: CommentReplyProps) {
  const handleDelete = () => {
    if (window.confirm("确定要删除这条评论吗？")) {
      onDelete(comment.id);
    }
  };

  return (
    <div className="comment-reply-item">
      <div className="comment-reply-content">
        <div className="comment-reply-header">
          <h4>
            <Image src={comment.author.avatar} alt="avatar" width={32} height={32} />
            {comment.author.name}
          </h4>
          {comment.isAuthor && (
            <div className="comment-reply-actions">
              <button onClick={handleDelete} className="comment-reply-action-btn">
                <MdOutlineDelete />
              </button>
            </div>
          )}
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