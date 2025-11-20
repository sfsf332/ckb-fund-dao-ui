'use client';

import { useState, useEffect } from 'react';
import { ProposalVotingProps, VoteOption, VotingStatus } from '../../types/voting';
import { formatNumber } from '../../utils/proposalUtils';
import { useI18n } from '@/contexts/I18nContext';
import './voting.css';
import { 
  IoThumbsUpOutline, 
  IoThumbsDownOutline, 
  IoCheckmarkCircleOutline
} from 'react-icons/io5';

export default function ProposalVoting({ votingInfo, onVote, className = '' }: ProposalVotingProps) {
  const { messages } = useI18n();
  const [timeLeft, setTimeLeft] = useState('');
  
  // 根据 userVoteIndex 确定用户投票选项
  // userVoteIndex: 1 = Agree (赞成), 2 = Against (反对)
  const userVote = votingInfo?.userVoteIndex 
    ? (votingInfo.userVoteIndex === 1 ? VoteOption.APPROVE : VoteOption.REJECT)
    : votingInfo?.userVote;
  
  // 检查投票是否正在上链中（state === 0）
  const isChainPending = votingInfo?.voteState === 0;

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
        
        setTimeLeft(`${days}D ${hours}H ${minutes} M`);
      } else {
        setTimeLeft(messages.proposalPhase.proposalVoting.timeLeft.ended);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // 每分钟更新一次

    return () => clearInterval(timer);
  }, [votingInfo, messages.proposalPhase.proposalVoting.timeLeft]);

  // 处理投票
  const handleVote = (option: VoteOption) => {
    if (votingInfo.status === VotingStatus.ENDED) return;
    // 如果投票正在上链中，不允许再次投票
    if (isChainPending) return;
    
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
        <h3 className="voting-title">{messages.proposalPhase.proposalVoting.title}</h3>
        <div className="voting-countdown">
          <span>{messages.proposalPhase.proposalVoting.deadline} {timeLeft}</span>
        </div>
      </div>

      {/* 投票统计 */}
      <div className="voting-stats">
        <div className="voting-total">
          <span>{messages.proposalPhase.proposalVoting.totalVotes} {formatNumber(votingInfo.totalVotes / 100000000)} CKB</span>
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
            <span className="vote-label">{messages.proposalPhase.proposalVoting.approve} {approveRate.toFixed(1)}%</span>
            <span className="vote-count">({formatNumber(votingInfo.approveVotes / 100000000)} CKB)</span>
          </div>
          <div className="vote-result reject">
            <span className="vote-label">{messages.proposalPhase.proposalVoting.reject} {rejectRate.toFixed(1)}%</span>
            <span className="vote-count">({formatNumber(votingInfo.rejectVotes / 100000000)} CKB)</span>
          </div>
        </div>
      </div>

      {/* 投票按钮 */}
      {votingInfo.status !== VotingStatus.ENDED && (
        <div className="voting-buttons">
          <div className="voting-buttons-row">
            <button
              className={`vote-button approve ${userVote === VoteOption.APPROVE ? 'selected' : ''}`}
              onClick={() => handleVote(VoteOption.APPROVE)}
              disabled={isChainPending}
            >
              <img src="/icon/agree.svg" alt="agree" className="vote-icon" />
              {messages.proposalPhase.proposalVoting.approve}
            </button>
            <button
              className={`vote-button reject ${userVote === VoteOption.REJECT ? 'selected' : ''}`}
              onClick={() => handleVote(VoteOption.REJECT)}
              disabled={isChainPending}
            >
              <img src="/icon/against.svg" alt="against" className="vote-icon" />
              {messages.proposalPhase.proposalVoting.reject}
            </button>
          </div>
          {isChainPending && (
            <div className="chain-pending-message">
              {(messages.proposalPhase.proposalVoting as { chainPending?: string }).chainPending || '投票结果上链中'}
            </div>
          )}
        </div>
      )}


      {/* 我的投票权 */}
    
        <span>{messages.proposalPhase.proposalVoting.myVotingPower} </span>
        <span className="power-amount">{formatNumber(votingInfo.userVotingPower / 100000000)} CKB</span>
      

      {/* 分隔线 */}
      <div className="voting-divider"></div>

      {/* 通过条件 */}
      <div className="voting-conditions">
        <h4 className="conditions-title">{messages.proposalPhase.proposalVoting.conditions.title}</h4>
        
        <div className="condition-item">
            <span>{messages.proposalPhase.proposalVoting.conditions.minTotalVotes}</span>
            <span className="condition-values">
              {formatNumber(votingInfo.totalVotes / 100000000)} / {formatNumber(votingInfo.conditions.minTotalVotes / 100000000)} CKB
            </span>
        
          <div className={`condition-status ${totalVotesMet ? 'met' : 'not-met'}`}>
            {totalVotesMet ? <IoCheckmarkCircleOutline size={16} /> : <span>×</span>}
          </div>
        </div>

        <div className="condition-item">
          
            <span>{messages.proposalPhase.proposalVoting.conditions.approveRate}</span>
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
