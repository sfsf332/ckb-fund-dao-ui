// 投票状态
export enum VotingStatus {
  PENDING = 'pending',     // 待投票
  VOTED = 'voted',         // 已投票
  ENDED = 'ended'          // 投票结束
}

// 投票选项
export enum VoteOption {
  APPROVE = "Agree",     // 赞成
  REJECT = "Reject"        // 反对
}

// 投票条件
export interface VotingConditions {
  minTotalVotes: number;   // 最低投票权重总数（shannon单位）
  minApprovalRate: number; // 最低赞成率
  currentTotalVotes: number; // 当前投票权重总数（shannon单位）
  currentApprovalRate: number; // 当前赞成率
}

// 投票信息
export interface VotingInfo {
  proposalId: string;
  title: string;
  endTime: string;         // 投票结束时间
  totalVotes: number;      // 总投票权重（shannon单位，1 CKB = 100000000 shannon）
  approveVotes: number;    // 赞成投票权重（shannon单位）
  rejectVotes: number;     // 反对投票权重（shannon单位）
  userVotingPower: number; // 用户投票权重（shannon单位）
  status: VotingStatus;
  conditions: VotingConditions;
}

// 用户投票信息
export interface UserVoteInfo {
  userVote?: VoteOption;   // 用户投票选项
  userVoteIndex?: number;  // 用户投票的候选人索引（1: Agree, 2: Against）
  voteState?: number;      // 投票状态（0: 上链中, 其他: 已确认）
}

// 投票组件 Props
export interface ProposalVotingProps {
  votingInfo: VotingInfo;
  userVoteInfo?: UserVoteInfo;
  onVote: (option: VoteOption) => void;
  className?: string;
  isVoting?: boolean; // 投票进行中状态，用于锁定操作区域
  proposalType?: string; // 提案类型，如 "funding" 或 "governance"
  budget?: string | number; // 预算金额（CKB），资金申请类提案需要
}
