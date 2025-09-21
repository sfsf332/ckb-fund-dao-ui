// 投票状态
export enum VotingStatus {
  PENDING = 'pending',     // 待投票
  VOTED = 'voted',         // 已投票
  ENDED = 'ended'          // 投票结束
}

// 投票选项
export enum VoteOption {
  APPROVE = 'approve',     // 赞成
  REJECT = 'reject'        // 反对
}

// 投票条件
export interface VotingConditions {
  minTotalVotes: number;   // 最低投票总数
  minApprovalRate: number; // 最低赞成率
  currentTotalVotes: number; // 当前总票数
  currentApprovalRate: number; // 当前赞成率
}

// 投票信息
export interface VotingInfo {
  proposalId: string;
  title: string;
  endTime: string;         // 投票结束时间
  totalVotes: number;      // 总票数
  approveVotes: number;    // 赞成票数
  rejectVotes: number;     // 反对票数
  userVotingPower: number; // 用户投票权
  userVote?: VoteOption;   // 用户投票选项
  status: VotingStatus;
  conditions: VotingConditions;
}

// 投票组件 Props
export interface ProposalVotingProps {
  votingInfo: VotingInfo;
  onVote: (option: VoteOption) => void;
  className?: string;
}
