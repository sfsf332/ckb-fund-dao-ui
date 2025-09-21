'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Proposal } from "../data/mockProposals";
import { formatNumber, getStatusClass, getStatusText, formatDate } from "../utils/proposalUtils";

interface ProposalItemProps {
  proposal: Proposal;
}

export default function ProposalItem({ proposal }: ProposalItemProps) {
  const router = useRouter();

  // 处理点击跳转到详情页
  const handleClick = () => {
    router.push(`/zh/proposal/detail?id=${proposal.id}`);
  };

  return (
    <li 
      className="proposal-item-clickable"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <h4>
        {proposal.title}
        <span className={getStatusClass(proposal.status)}>
          {getStatusText(proposal.status)}
        </span>
      </h4>
      
      <div className="proposal_person">
        <Image src={proposal.proposer.avatar} alt="avatar" width={40} height={40} />
        <div className="name">
          <h3>{proposal.proposer.name}</h3>
          <p>{proposal.proposer.did}</p>
        </div>
        <p>{formatDate(proposal.createdAt)}</p>
      </div>
      
      <div className="proposal_detail">
        <p>申请预算</p>
        <p>{formatNumber(proposal.budget)} CKB</p>
      </div>
      
      {/* 投票状态显示 */}
      {proposal.voting && (
        <div className="proposal_voting">
          <div className="vote-item approve">
            <p>赞成</p>
            <p>{proposal.voting.approve}%</p>
          </div>
          <div className="vote-item oppose">
            <p>反对</p>
            <p>{proposal.voting.oppose}%</p>
          </div>
        </div>
      )}
      
      {/* 进度显示 */}
      <div className="proposal_progress">
        {proposal.milestones ? (
          <>
            <p>进度: 里程碑 {proposal.milestones.current}/{proposal.milestones.total}</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${proposal.milestones.progress}%`}}
              ></div>
            </div>
          </>
        ) : proposal.voting ? (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{width: `${proposal.voting.approve}%`}}
            ></div>
          </div>
        ) : (
          <>
            <p>进度: -</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '0%'}}></div>
            </div>
          </>
        )}
      </div>
    </li>
  );
}
