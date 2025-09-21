"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { CommentQuoteProps } from "@/types/comment";
import "./comment.css";
import "react-quill-new/dist/quill.snow.css";

// 动态导入ReactQuill，禁用SSR
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "200px",
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

export default function CommentQuote({
  onSubmit,
  placeholder = "请填写评论",
  parentId,
  isReply = false,
  quotedText = ""
}: CommentQuoteProps) {
  const [content, setContent] = useState(quotedText);
  const [isClient, setIsClient] = useState(false);

  // 检查是否在客户端
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 当quotedText变化时更新content
  useEffect(() => {
    console.log('CommentQuote useEffect triggered:', { quotedText, isClient });
    if (quotedText && isClient) {
      console.log('Setting quoted text:', quotedText);
      // 直接设置content状态，让ReactQuill处理
      const quotedContent = `<blockquote>${quotedText}</blockquote><p><br></p>`;
      console.log('Setting content to:', quotedContent);
      setContent(quotedContent);
      
      // 延迟聚焦编辑器并设置光标位置
      setTimeout(() => {
        const editor = document.querySelector('.ql-editor') as HTMLElement;
        if (editor) {
          console.log('Focusing editor after quote');
          editor.focus();
          // 将光标移动到引用内容之后
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const quill = (editor as any).__quill;
          if (quill) {
            // 将光标定位在引用内容后的空段落中
            const totalLength = quill.getLength();
            quill.setSelection(totalLength - 1, 0);
          }
        }
      }, 500);
    }
  }, [quotedText, isClient]);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content, parentId);
      setContent("");
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["blockquote", "code-block"],
      ["image"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "blockquote",
    "image",
    "code-block",
  ];

  return (
    <div className={`comment-quote ${isReply ? "comment-quote-reply" : ""}`}>
      <div className="comment-quote-avatar">
        <Image src="/avatar.jpg" alt="avatar" width={40} height={40} />
      </div>
      <div className="comment-quote-main">
        <div className="editor-container">
          {isClient ? (
            <div className="quill-wrapper">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                placeholder={placeholder}
              />
            </div>
          ) : (
            <div
              style={{
                borderRadius: "8px",
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
        <div className="comment-quote-actions">
          <button
            onClick={handleSubmit}
            className="comment-quote-submit"
            disabled={!content.trim()}
          >
            发布
          </button>
        </div>
      </div>
    </div>
  );
}
