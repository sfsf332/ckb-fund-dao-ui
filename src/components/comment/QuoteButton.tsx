"use client";

import React, { useState, useEffect } from "react";

interface QuoteButtonProps {
  onQuote: (selectedText: string) => void;
}

export default function QuoteButton({ onQuote }: QuoteButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 确保在客户端环境中运行
    if (typeof window === 'undefined') return;
    
    setIsClient(true);

    const proposalDetail = document.getElementById('proposal-detail');
    if (!proposalDetail) {
      return;
    }

    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      console.log('Selection detected:', text);

      if (text && text.length > 0 && selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        
        const newPosition = {
          top: rect.top - 50,
          left: rect.left + rect.width / 2
        };
        setSelectedText(text);
        setPosition(newPosition);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // 如果点击的是提案详情区域内，不隐藏（让选择逻辑处理）
      if (target.closest('#proposal-detail')) {
        console.log('Clicked in proposal detail, not hiding');
        return;
      }
      
      // 点击外部隐藏按钮
      setIsVisible(false);
      setSelectedText('');
    };

    const handleScroll = () => {
      setIsVisible(false);
    };

    // 在 proposal-detail 元素上监听 mouseup 事件
    proposalDetail.addEventListener('mouseup', handleSelection);
    // 全局监听点击事件以处理点击外部的情况
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      proposalDetail.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  if (!isClient) {
    console.log('Not on client, returning null');
    return null;
  }

  console.log('Rendering QuoteButton, isVisible:', isVisible, 'position:', position);

  return (
    <>
    

      {/* 选择检测的引用按钮 */}
     
        <div
          className="quote-button-container"
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            transform: 'translateX(-50%)',
            display: isVisible ? 'block' : 'none',
            zIndex: 9999,
            pointerEvents: 'auto',
          }}
        >
          <button
            className="quote-button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuote(selectedText);
              setIsVisible(false);
              setSelectedText('');
              window.getSelection()?.removeAllRanges();
            }}
            title="引用此段文字"
            style={{
              background: '#00CC9B',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 12px rgba(0, 204, 155, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
             引用
          </button>
        </div>
      
    </>
  );
}
