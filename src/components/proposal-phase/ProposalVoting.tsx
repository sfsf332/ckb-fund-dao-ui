'use client';

import { useState, useEffect } from 'react';
import { ProposalVotingProps, VoteOption, VotingStatus } from '../../types/voting';
import { formatNumber } from '../../utils/proposalUtils';
import './voting.css';
import { 
  IoThumbsUpOutline, 
  IoThumbsDownOutline, 
  IoCheckmarkCircleOutline,
  IoTimeOutline 
} from 'react-icons/io5';

export default function ProposalVoting({ votingInfo, onVote, className = '' }: ProposalVotingProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [userVote, setUserVote] = useState<VoteOption | undefined>(votingInfo?.userVote);

  // 计算倒计时
  useEffect(() => {
    if (!votingInfo) return;
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(votingInfo.endTime).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft(`${days}天 ${hours}小时 ${minutes}分钟`);
      } else {
        setTimeLeft('投票已结束');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // 每分钟更新一次

    return () => clearInterval(timer);
  }, [votingInfo]);

  // 处理投票
  const handleVote = (option: VoteOption) => {
    if (votingInfo.status === VotingStatus.ENDED) return;
    
    setUserVote(option);
    onVote(option);
  };

  // 如果 votingInfo 不存在，不渲染组件
  if (!votingInfo) {
    return null;
  }

  // 计算百分比
  const approveRate = votingInfo.totalVotes > 0 ? (votingInfo.approveVotes / votingInfo.totalVotes) * 100 : 0;
  const rejectRate = votingInfo.totalVotes > 0 ? (votingInfo.rejectVotes / votingInfo.totalVotes) * 100 : 0;

  // 检查通过条件
  const totalVotesMet = votingInfo.totalVotes >= votingInfo.conditions.minTotalVotes;
  const approvalRateMet = approveRate >= votingInfo.conditions.minApprovalRate;

  return (
    <div className={`proposal-voting-card ${className}`}>
      {/* 标题和倒计时 */}
      <div className="voting-header">
        <h3 className="voting-title">提案投票</h3>
        <div className="voting-countdown">
          <span>截至: {timeLeft}</span>
        </div>
      </div>

      {/* 投票统计 */}
      <div className="voting-stats">
        <div className="voting-total">
          <span>总票数: {formatNumber(votingInfo.totalVotes)}</span>
        </div>
        
        {/* 进度条 */}
        <div className="voting-progress">
          <div className="progress-bar">
            <div 
              className="progress-approve" 
              style={{ width: `${approveRate}%` }}
            ></div>
            <div 
              className="progress-reject" 
              style={{ width: `${rejectRate}%` }}
            ></div>
          </div>
        </div>

        {/* 投票结果 */}
        <div className="voting-results">
          <div className="vote-result approve">
            <span className="vote-label">赞成 {approveRate.toFixed(1)}%</span>
            <span className="vote-count">({formatNumber(votingInfo.approveVotes)})</span>
          </div>
          <div className="vote-result reject">
            <span className="vote-label">反对 {rejectRate.toFixed(1)}%</span>
            <span className="vote-count">({formatNumber(votingInfo.rejectVotes)})</span>
          </div>
        </div>
      </div>

      {/* 投票按钮 */}
      {votingInfo.status !== VotingStatus.ENDED && (
        <div className="voting-buttons">
          <button
            className={`vote-button approve ${userVote === VoteOption.APPROVE ? 'selected' : ''}`}
            onClick={() => handleVote(VoteOption.APPROVE)}
          >
            <IoThumbsUpOutline size={14} />
            赞成
          </button>
          <button
            className={`vote-button reject ${userVote === VoteOption.REJECT ? 'selected' : ''}`}
            onClick={() => handleVote(VoteOption.REJECT)}
          >
            <IoThumbsDownOutline size={14} />
            反对
          </button>
        </div>
      )}


      {/* 我的投票权 */}
    
        <span>我的投票权: </span>
        <span className="power-amount">{formatNumber(votingInfo.userVotingPower)} CKB</span>
      

      {/* 分隔线 */}
      <div className="voting-divider"></div>

      {/* 通过条件 */}
      <div className="voting-conditions">
        <h4 className="conditions-title">通过条件</h4>
        
        <div className="condition-item">
            <span>最低投票总数</span>
            <span className="condition-values">
              {formatNumber(votingInfo.totalVotes)} / {formatNumber(votingInfo.conditions.minTotalVotes)}
            </span>
        
          <div className={`condition-status ${totalVotesMet ? 'met' : 'not-met'}`}>
            {totalVotesMet ? <IoCheckmarkCircleOutline size={16} /> : <span>×</span>}
          </div>
        </div>

        <div className="condition-item">
          
            <span>赞成票数占比</span>
            <span className="condition-values">
              {approveRate.toFixed(1)}% / {votingInfo.conditions.minApprovalRate}%
            </span>
        
          <div className={`condition-status ${approvalRateMet ? 'met' : 'not-met'}`}>
            {approvalRateMet ? <IoCheckmarkCircleOutline size={16} /> : <span>×</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
