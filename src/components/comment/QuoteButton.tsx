"use client";

import React, { useState, useEffect } from "react";
import { MdFormatQuote } from "react-icons/md";

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
    console.log('QuoteButton mounted on client');

    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      console.log('Selection detected:', text);

      if (text && text.length > 0) {
        // 检查选中的文字是否在提案详情区域内
        const proposalDetail = document.getElementById('proposal-detail');
        console.log('Proposal detail element:', proposalDetail);
        
        if (proposalDetail && selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const proposalRect = proposalDetail.getBoundingClientRect();
          
          console.log('Selection rect:', rect);
          console.log('Proposal rect:', proposalRect);
          
          // 检查选中区域是否在提案详情内
          if (rect.top >= proposalRect.top && rect.bottom <= proposalRect.bottom) {
            console.log('Selection is within proposal detail, showing button');
            const newPosition = {
              top: rect.top - 50, // 使用 fixed 定位，不需要加 scrollY
              left: rect.left + rect.width / 2 // 使用 fixed 定位，不需要加 scrollX
            };
            console.log('Button position:', newPosition);
            setSelectedText(text);
            setPosition(newPosition);
            setIsVisible(true);
            return; // 这里return，不会执行后面的setIsVisible(false)
          } else {
            console.log('Selection is outside proposal detail');
          }
        } else {
          console.log('No proposal detail element or no selection range');
        }
      }
      
      // 只有在没有有效选择时才隐藏按钮
      console.log('No valid selection, hiding button');
      setIsVisible(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      // 如果点击的是引用按钮本身，不隐藏
      const target = event.target as HTMLElement;
    
      
      // 如果点击的是提案详情区域内的文字，不隐藏（让选择逻辑处理）
      if (target.closest('#proposal-detail')) {
        console.log('Clicked in proposal detail, not hiding');
        return;
      }
      
      // 其他情况隐藏按钮
      console.log('Click outside detected, hiding button');
      setIsVisible(false);
      setSelectedText('');
    };

    const handleScroll = () => {
      setIsVisible(false);
      
    };

    const handleSelectionChange = () => {
      // 当选择发生变化时检查是否需要隐藏按钮
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (!text || text.length === 0) {
        // 没有选择文字，隐藏按钮
        setIsVisible(false);
        return;
      }
      
      // 检查选择是否在提案详情区域内
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const proposalDetail = document.getElementById('proposal-detail');
        
        if (proposalDetail) {
          const proposalRect = proposalDetail.getBoundingClientRect();
          if (rect.top < proposalRect.top || rect.bottom > proposalRect.bottom) {
            // 选择不在提案详情区域内，隐藏按钮
            setIsVisible(false);
          }
        }
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('selectionchange', handleSelectionChange);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('selectionchange', handleSelectionChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, selectedText]);


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
              console.log('Quote button clicked, hiding button');
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
