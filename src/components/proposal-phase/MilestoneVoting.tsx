'use client';

import { useState, useEffect } from 'react';
import { MilestoneVotingProps, MilestoneVoteOption, MilestoneVotingStatus } from '../../types/milestoneVoting';
import './milestoneVoting.css';

export default function MilestoneVoting({ 
  votingInfo, 
  onVote, 
  className = '' 
}: MilestoneVotingProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [userVote, setUserVote] = useState<MilestoneVoteOption | undefined>(votingInfo.userVote);

  // 计算倒计时
  useEffect(() => {
    if (!votingInfo) return;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(votingInfo.endTime).getTime();
      const timeDiff = endTime - now;

      if (timeDiff <= 0) {
        setTimeLeft('投票已结束');
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days}天${hours}小时${minutes}分钟`);
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 60000); // 每分钟更新一次

    return () => clearInterval(timer);
  }, [votingInfo]);

  // 处理投票
  const handleVote = (option: MilestoneVoteOption) => {
    if (votingInfo.status === MilestoneVotingStatus.ENDED || 
        votingInfo.status === MilestoneVotingStatus.APPROVED || 
        votingInfo.status === MilestoneVotingStatus.REJECTED) return;
    
    setUserVote(option);
    onVote(votingInfo.milestoneId, option);
  };

  // 格式化数字
  const formatNumber = (num: number) => {
    return num.toLocaleString('zh-CN');
  };

  // 格式化百分比
  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(1)}%`;
  };

  if (!votingInfo) {
    return null;
  }

  return (
    <div className={`milestone-voting-card ${className}`}>
      <div className="milestone-voting-header">
        <h3 className="milestone-voting-title">{votingInfo.milestoneTitle}确认投票</h3>
        <div className="milestone-voting-time">
          截至: {timeLeft}
        </div>
      </div>

      <div className="milestone-voting-stats">
        <div className="voting-stat">
          <span>总票数: {formatNumber(votingInfo.totalVotes)}</span>
        </div>
        
        <div className="milestone-voting-progress">
          <div className="progress-bar">
            <div 
              className="progress-approve" 
              style={{ width: `${votingInfo.approveRate}%` }}
            ></div>
            <div 
              className="progress-reject" 
              style={{ width: `${votingInfo.rejectRate}%` }}
            ></div>
          </div>
        </div>

        <div className="progress-labels">
          <div className="progress-label approve">
            <span className="label-text">赞成 {formatPercentage(votingInfo.approveRate)}</span>
            <span className="vote-count">({formatNumber(votingInfo.approveVotes)})</span>
          </div>
          <div className="progress-label reject">
            <span className="label-text">反对 {formatPercentage(votingInfo.rejectRate)}</span>
            <span className="vote-count">({formatNumber(votingInfo.rejectVotes)})</span>
          </div>
        </div>
      </div>

      {(votingInfo.status === MilestoneVotingStatus.PENDING || votingInfo.status === MilestoneVotingStatus.IN_PROGRESS) && (
        <div className="milestone-voting-actions">
          <button
            className={`vote-button approve ${userVote === MilestoneVoteOption.APPROVE ? 'selected' : ''}`}
            onClick={() => handleVote(MilestoneVoteOption.APPROVE)}
            disabled={false}
          >
            👍 赞成拨款
          </button>
          <button
            className={`vote-button reject ${userVote === MilestoneVoteOption.REJECT ? 'selected' : ''}`}
            onClick={() => handleVote(MilestoneVoteOption.REJECT)}
            disabled={false}
          >
            👎 反对拨款
          </button>
        </div>
      )}

      <div className="milestone-voting-power">
        <span>我的投票权: </span>
        <span className="power-value">{formatNumber(votingInfo.userVotingPower)} CKB</span>
      </div>

      <div className="milestone-voting-requirements">
        <h4 className="requirements-title">通过条件</h4>
        <div className="requirement-item">
          <div className="requirement-info">
            <span className="requirement-label">最低投票总数</span>
            <span className="requirement-value">
              {formatNumber(votingInfo.totalVotes)} / {formatNumber(votingInfo.requirements.minTotalVotes)}
            </span>
          </div>
          <div className={`requirement-status ${votingInfo.isRequirementMet.totalVotes ? 'met' : 'not-met'}`}>
            {votingInfo.isRequirementMet.totalVotes ? '✓' : '✗'}
          </div>
        </div>
        <div className="requirement-item">
          <div className="requirement-info">
            <span className="requirement-label">赞成票数占比</span>
            <span className="requirement-value">
              {formatPercentage(votingInfo.approveRate)} / {formatPercentage(votingInfo.requirements.minApproveRate)}
            </span>
          </div>
          <div className={`requirement-status ${votingInfo.isRequirementMet.approveRate ? 'met' : 'not-met'}`}>
            {votingInfo.isRequirementMet.approveRate ? '✓' : '✗'}
          </div>
        </div>
      </div>
    </div>
  );
}
