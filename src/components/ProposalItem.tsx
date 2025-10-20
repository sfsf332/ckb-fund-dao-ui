'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Proposal } from "../utils/proposalUtils";
import { ProposalListItem } from "@/server/proposal";
import { formatNumber, formatDate, getStatusText, getStatusTagClass } from "../utils/proposalUtils";
import { postUriToHref } from "@/lib/postUriHref";
import { useI18n } from "@/contexts/I18nContext";
import Tag from "@/components/ui/tag/Tag";

interface ProposalItemProps {
  proposal: Proposal | ProposalListItem;
}

export default function ProposalItem({ proposal }: ProposalItemProps) {
  const router = useRouter();
  const { locale } = useI18n();

  // 兼容两种数据结构 (mockProposals 和 API)
  const isAPIFormat = 'record' in proposal;
  
  const title = isAPIFormat ? proposal.record.data.title : (proposal as Proposal).title;
  
  let budget: number;
  if (isAPIFormat) {
    budget = parseFloat(proposal.record.data.budget || '0');
  } else {
    const mockBudget = (proposal as Proposal).budget;
    budget = typeof mockBudget === 'string' ? parseFloat(mockBudget) : mockBudget;
  }
  
  const createdAt = isAPIFormat ? proposal.record.created : (proposal as Proposal).createdAt;
  
  const author = isAPIFormat 
    ? { name: proposal.author.displayName, did: proposal.author.did, avatar: '/avatar.jpg' }
    : (proposal as Proposal).proposer;
  const avatar = author.avatar || '/avatar.jpg'; // 提供默认头像
  
  // 处理里程碑数据
  const milestones = isAPIFormat && proposal.record.data.milestones && proposal.record.data.milestones.length > 0
    ? {
        current: 1, // 默认为第一个
        total: proposal.record.data.milestones.length,
        progress: 0,
      }
    : ('milestones' in proposal ? (proposal as Proposal).milestones : undefined);

  // 处理点击跳转到详情页
  const handleClick = () => {
    // 优先使用 proposal.uri，如果没有则使用 proposal.id
    const uri = ('uri' in proposal && proposal.uri) ? proposal.uri : (('id' in proposal && proposal.id) ? proposal.id : '');
    const path = `/${locale}/proposal/${postUriToHref(uri)}`;

    router.push(path);
  };

  const voting = !isAPIFormat && 'voting' in proposal ? (proposal as Proposal).voting : undefined;

  return (
    <li 
      className="proposal-item-clickable"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <h4>
        {title}
        <Tag type="status" size="sm" className={getStatusTagClass(proposal.state)}>
          {getStatusText(proposal.state)}
        </Tag>
      </h4>
      <div className="proposal_person">
        <Image src={avatar} alt="avatar" width={40} height={40} />
        <div className="name">
          <h3>{author.name}</h3>
          <p>{author.did}</p>
        </div>
        <p>{formatDate(createdAt)}</p>
      </div>
      
      <div className="proposal_detail">
        <p>申请预算</p>
        <p>{formatNumber(budget)} CKB</p>
      </div>
      
      {/* 投票状态显示 */}
      {voting && (
        <div className="proposal_voting">
          <div className="vote-item approve">
            <p>赞成</p>
            <p>{voting.approve}%</p>
          </div>
          <div className="vote-item oppose">
            <p>反对</p>
            <p>{voting.oppose}%</p>
          </div>
        </div>
      )}
      
      {/* 进度显示 */}
      <div className="proposal_progress">
        {milestones ? (
          <>
            <p>进度: 里程碑 {milestones.current}/{milestones.total}</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${milestones.progress}%`}}
              ></div>
            </div>
          </>
        ) : voting ? (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{width: `${voting.approve}%`}}
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
