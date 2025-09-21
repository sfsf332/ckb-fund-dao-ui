import { TimelineEvent, TimelineEventType, TimelineEventStatus } from '../types/timeline';
import { Proposal, ProposalStatus } from '../data/mockProposals';

// 根据提案状态生成当前阶段的时间线事件
export const generateTimelineEvents = (proposal: Proposal): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  const createdAt = new Date(proposal.createdAt);
  
  // 基础事件：提案发布
  events.push({
    id: `${proposal.id}-published`,
    type: TimelineEventType.PROPOSAL_PUBLISHED,
    status: TimelineEventStatus.COMPLETED,
    title: '提案发布',
    description: `提案 "${proposal.title}" 已发布，开始社区审议`,
    date: proposal.createdAt,
    isImportant: true
  });

  // 根据提案状态添加相应事件
  switch (proposal.status) {
    case ProposalStatus.REVIEW:
      // 审议阶段 - 只显示当前阶段的事件
      events.push({
        id: `${proposal.id}-review-start`,
        type: TimelineEventType.REVIEW_START,
        status: TimelineEventStatus.IN_PROGRESS,
        title: '社区审议中',
        description: '提案正在接受社区审议，包括质询和讨论',
        date: new Date(createdAt.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isImportant: true
      });
      break;

    case ProposalStatus.VOTE:
      // 投票阶段 - 只显示当前阶段的事件
      events.push({
        id: `${proposal.id}-vote-start`,
        type: TimelineEventType.VOTE_START,
        status: TimelineEventStatus.IN_PROGRESS,
        title: '提案投票中',
        description: '提案正在接受社区投票，请参与投票',
        date: new Date(createdAt.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isImportant: true
      });
      break;

    case ProposalStatus.APPROVED:
      // 执行阶段 - 只显示当前阶段的事件
      events.push({
        id: `${proposal.id}-approved`,
        type: TimelineEventType.PROPOSAL_APPROVED,
        status: TimelineEventStatus.COMPLETED,
        title: '提案已通过',
        description: '提案已通过社区投票，正在执行中',
        date: new Date(createdAt.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isImportant: true
      });
      break;

    case ProposalStatus.REJECTED:
      // 已拒绝 - 只显示结果
      events.push({
        id: `${proposal.id}-rejected`,
        type: TimelineEventType.PROPOSAL_REJECTED,
        status: TimelineEventStatus.COMPLETED,
        title: '提案已拒绝',
        description: '提案未通过社区投票，已被拒绝',
        date: new Date(createdAt.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isImportant: true
      });
      break;

    case ProposalStatus.MILESTONE:
      // 执行阶段 - 只显示当前里程碑
      if (proposal.milestones) {
        const currentMilestone = proposal.milestones.current;
        events.push({
          id: `${proposal.id}-milestone-${currentMilestone}`,
          type: TimelineEventType.MILESTONE_TRACKING,
          status: TimelineEventStatus.IN_PROGRESS,
          title: `里程碑 ${currentMilestone} 进行中`,
          description: `项目里程碑 ${currentMilestone} 正在执行中`,
          date: new Date(createdAt.getTime() + (20 + (currentMilestone - 1) * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isImportant: true
        });
      }
      break;

    case ProposalStatus.ENDED:
      // 项目完成 - 只显示最终结果
      events.push({
        id: `${proposal.id}-completed`,
        type: TimelineEventType.PROJECT_COMPLETED,
        status: TimelineEventStatus.COMPLETED,
        title: '项目已完成',
        description: '项目已成功完成所有里程碑',
        date: new Date(createdAt.getTime() + 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isImportant: true
      });
      break;
  }

  return events;
};
