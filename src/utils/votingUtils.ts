import { VotingInfo, VoteOption, VotingStatus } from '../types/voting';
import { Proposal, ProposalStatus } from './proposalUtils';

// 生成投票信息
export const generateVotingInfo = (proposal: Proposal): VotingInfo => {
  const createdAt = new Date(proposal.createdAt);
  const endTime = new Date(createdAt.getTime() + 14 * 24 * 60 * 60 * 1000); // 14天后结束
  
  // 使用提案中的投票数据，如果没有则生成默认值
  const totalVotes = proposal.voting?.totalVotes || Math.floor(Math.random() * 10000000) + 5000000;
  const approveRate = proposal.voting?.approve || Math.floor(Math.random() * 40) + 40; // 40-80%
  const approveVotes = Math.floor(totalVotes * approveRate / 100);
  const rejectVotes = totalVotes - approveVotes;
  
  // 模拟用户投票权（根据提案类型调整）
  const userVotingPower = proposal.type === 'governance' ? 2000000 : 1000000; // 治理提案有更多投票权
  
  // 模拟用户投票状态（30%概率已投票）
  const userVote: VoteOption | undefined = Math.random() < 0.3 
    ? (Math.random() > 0.5 ? VoteOption.APPROVE : VoteOption.REJECT)
    : undefined;
  
  // 确定投票状态
  let status: VotingStatus;
  if (proposal.state === ProposalStatus.VOTE) {
    status = userVote ? VotingStatus.VOTED : VotingStatus.PENDING;
  } else if (proposal.state === ProposalStatus.APPROVED || proposal.state === ProposalStatus.REJECTED) {
    status = VotingStatus.ENDED;
  } else {
    status = VotingStatus.PENDING;
  }

  return {
    proposalId: proposal.id,
    title: proposal.title,
    endTime: endTime.toISOString(),
    totalVotes,
    approveVotes,
    rejectVotes,
    userVotingPower,
    userVote,
    status,
    conditions: {
      minTotalVotes: 15000000, // 最低1500万票
      minApprovalRate: 51,     // 最低51%赞成率
      currentTotalVotes: totalVotes,
      currentApprovalRate: (approveVotes / totalVotes) * 100
    }
  };
};

// 处理投票
export const handleVote = (proposalId: string, option: VoteOption): Promise<boolean> => {
  return new Promise((resolve) => {
    // 模拟API调用
    setTimeout(() => {
      console.log(`投票: 提案 ${proposalId} - ${option === VoteOption.APPROVE ? '赞成' : '反对'}`);
      resolve(true);
    }, 1000);
  });
};

// 检查投票是否通过
export const checkVotingPassed = (votingInfo: VotingInfo): boolean => {
  const totalVotesMet = votingInfo.totalVotes >= votingInfo.conditions.minTotalVotes;
  const approvalRateMet = votingInfo.conditions.currentApprovalRate >= votingInfo.conditions.minApprovalRate;
  
  return totalVotesMet && approvalRateMet;
};
