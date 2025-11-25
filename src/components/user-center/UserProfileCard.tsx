'use client';

import { useState, useEffect, useRef } from 'react';
import { MdCheck, MdEdit } from "react-icons/md";
import { FaDiscord,FaTelegramPlane   } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import useUserInfoStore from "@/store/userInfo";
import { useTranslation } from "@/utils/i18n";
import Avatar from "@/components/Avatar";
import { getUserDisplayNameFromStore } from "@/utils/userDisplayUtils";

interface UserProfileCardProps {
  className?: string;
}

export default function UserProfileCard({ className = '' }: UserProfileCardProps) {
  const { t } = useTranslation();
  const { userInfo, userProfile } = useUserInfoStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [joinDate] = useState('2025年1月1日');
  const [expandedConnection, setExpandedConnection] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [userName, setUserName] = useState(getUserDisplayNameFromStore(userInfo, userProfile));
  
  // 当 userProfile 或 userInfo 更新时，更新 userName
  useEffect(() => {
    if (!isEditing) {
      const displayName = getUserDisplayNameFromStore(userInfo, userProfile);
      if (displayName) {
        setUserName(displayName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.did, userInfo?.handle, userProfile?.displayName, isEditing]);
  
  const nervosTalk = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 8.64583V5L19 5.03646V8.64583H15.6283V15.3542L11.9634 19V5.14583L8.44503 8.64583H5Z" fill="white"/>
  </svg>
  ;
  
  const socialConnections = [
    { 
      id: 'nervos-talk',
      name: t('userProfile.connectWithNervosTalk'), 
      icon: nervosTalk, 
      connected: false,
      username: null
    },
    { 
      id: 'x-twitter',
      name: t('userProfile.connectWithX'), 
      icon: <FaXTwitter />, 
      connected: false,
      username: null
    },
    { 
      id: 'discord',
      name: t('userProfile.connectWithDiscord'), 
      icon: <FaDiscord color='#5865F2' />, 
      connected: true,
      username: null
    },
    { 
      id: 'telegram',
      name: t('userProfile.connectWithTelegram'), 
      icon: <FaTelegramPlane color='#0088cc' />, 
      connected: false,
      username: null
    },
  ];

  const handleConnectionClick = (connectionId: string) => {
    if (expandedConnection === connectionId) {
      setExpandedConnection(null);
    } else {
      setExpandedConnection(connectionId);
    }
  };

  const handleConnect = (connectionId: string) => {
    console.log(t('userProfile.connectLog', { connectionId }));
    // 这里可以添加实际的连接逻辑
    setExpandedConnection(null);
  };

  const handleUnbind = (connectionId: string) => {
    console.log(t('userProfile.unbindLog', { connectionId }));
    // 这里可以添加实际的解绑逻辑
    setExpandedConnection(null);
  };

  // 点击外部区域关闭展开菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setExpandedConnection(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={cardRef} className={`user-profile-card ${className} user-profile-card-disabled`}>
      <div className="disabled-overlay"></div>
      <div className="user-info">
        <div className="user-avatar">
          <Avatar
            did={userInfo?.did}
            size={64}
          />
          <div className="avatar-edit-icon">
            <MdEdit />
          </div>
        </div>
        <div className="user-name-section">
          {isEditing ? (
            <div className="user-name-edit-container">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="user-name-input"
                onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
                autoFocus
              />
              <button
                className="user-name-confirm-button"
                onClick={() => setIsEditing(false)}
              >
                <MdCheck />
              </button>
            </div>
          ) : (
            <h2 className="user-name" onClick={() => setIsEditing(true)}>
              {userName}
            </h2>
          )}
          <p className="join-date">{t('userProfile.joinedOn', { date: joinDate })}</p>
        </div>
        
       
      </div>

      <div className="social-connections">
        {socialConnections.map((connection) => (
          <div key={connection.id} className="connection-item">
            <button
              className={`connection-button ${connection.connected ? 'connected' : ''}`}
              onClick={() => handleConnectionClick(connection.id)}
            >
              <div className="connection-info">
                <span className="connection-name">
                  {connection.connected && connection.username 
                    ? connection.username 
                    : connection.name
                  }
                </span>
                <span className="connection-icon">{connection.icon}</span>
              </div>
              {expandedConnection === connection.id && (
                <div className="connection-actions">
                  {connection.connected ? (
                    <button
                      className="unbind-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnbind(connection.id);
                      }}
                    >
                      {t('userProfile.unbindAccount')}
                    </button>
                  ) : (
                    <button
                      className="connect-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnect(connection.id);
                      }}
                    >
                      {t('userProfile.connect')}
                    </button>
                  )}
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
