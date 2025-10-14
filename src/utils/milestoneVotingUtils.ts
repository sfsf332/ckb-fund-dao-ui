import { MilestoneVotingInfo, MilestoneVoteOption, MilestoneVotingStatus } from '../types/milestoneVoting';
import { Proposal } from './proposalUtils';

// 生成里程碑投票信息
export const generateMilestoneVotingInfo = (proposal: Proposal, milestoneId: string): MilestoneVotingInfo => {
  const createdAt = new Date(proposal.createdAt);
  const endTime = new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000); // 3天后结束
  
  // 模拟投票数据
  const totalVotes = 8000000;
  const approveVotes = 6000000;
  const rejectVotes = 2000000;
  const approveRate = (approveVotes / totalVotes) * 100;
  const rejectRate = (rejectVotes / totalVotes) * 100;
  
  // 模拟用户投票权
  const userVotingPower = 1000000;
  
  // 模拟用户投票（30%概率已投票）
  const userVote = Math.random() < 0.3 ? 
    (Math.random() < 0.7 ? MilestoneVoteOption.APPROVE : MilestoneVoteOption.REJECT) : 
    undefined;
  
  // 投票要求
  const minTotalVotes = 5000000;
  const minApproveRate = 49;
  
  // 检查是否满足要求
  const isRequirementMet = {
    totalVotes: totalVotes >= minTotalVotes,
    approveRate: approveRate >= minApproveRate
  };
  
  // 确定投票状态
  let status: MilestoneVotingStatus;
  if (isRequirementMet.totalVotes && isRequirementMet.approveRate) {
    status = MilestoneVotingStatus.APPROVED;
  } else if (isRequirementMet.totalVotes && !isRequirementMet.approveRate) {
    status = MilestoneVotingStatus.REJECTED;
  } else {
    status = MilestoneVotingStatus.IN_PROGRESS;
  }
  
  return {
    milestoneId,
    milestoneTitle: `里程碑 ${milestoneId.split('-').pop()}`,
    status,
    endTime: endTime.toISOString(),
    totalVotes,
    approveVotes,
    rejectVotes,
    approveRate,
    rejectRate,
    userVote,
    userVotingPower,
    requirements: {
      minTotalVotes,
      minApproveRate
    },
    isRequirementMet
  };
};

// 处理里程碑投票
export const handleMilestoneVote = (
  votingInfo: MilestoneVotingInfo, 
  option: MilestoneVoteOption
): MilestoneVotingInfo => {
  // 这里应该调用实际的投票API
  // 现在只是模拟更新本地状态
  return {
    ...votingInfo,
    userVote: option,
    // 模拟投票后的数据更新
    totalVotes: votingInfo.totalVotes + votingInfo.userVotingPower,
    approveVotes: option === MilestoneVoteOption.APPROVE ? 
      votingInfo.approveVotes + votingInfo.userVotingPower : 
      votingInfo.approveVotes,
    rejectVotes: option === MilestoneVoteOption.REJECT ? 
      votingInfo.rejectVotes + votingInfo.userVotingPower : 
      votingInfo.rejectVotes,
    approveRate: option === MilestoneVoteOption.APPROVE ? 
      ((votingInfo.approveVotes + votingInfo.userVotingPower) / (votingInfo.totalVotes + votingInfo.userVotingPower)) * 100 :
      (votingInfo.approveVotes / (votingInfo.totalVotes + votingInfo.userVotingPower)) * 100,
    rejectRate: option === MilestoneVoteOption.REJECT ? 
      ((votingInfo.rejectVotes + votingInfo.userVotingPower) / (votingInfo.totalVotes + votingInfo.userVotingPower)) * 100 :
      (votingInfo.rejectVotes / (votingInfo.totalVotes + votingInfo.userVotingPower)) * 100
  };
};
