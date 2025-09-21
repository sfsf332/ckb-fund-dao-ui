import { ProposalStatus } from "../data/mockProposals";

// 格式化数字显示
export const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN');
};

// 获取状态标签样式
export const getStatusClass = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.VOTE:
      return 'status-tag vote';
    case ProposalStatus.REVIEW:
      return 'status-tag review';
    case ProposalStatus.MILESTONE:
      return 'status-tag milestone';
    case ProposalStatus.ENDED:
      return 'status-tag ended';
    case ProposalStatus.APPROVED:
      return 'status-tag approved';
    case ProposalStatus.REJECTED:
      return 'status-tag rejected';
    default:
      return 'status-tag';
  }
};

// 获取状态显示文本
export const getStatusText = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.VOTE:
      return '投票中';
    case ProposalStatus.REVIEW:
      return '社区审议中';
    case ProposalStatus.MILESTONE:
      return '里程碑交付中';
    case ProposalStatus.ENDED:
      return '结束';
    case ProposalStatus.APPROVED:
      return '已通过';
    case ProposalStatus.REJECTED:
      return '已拒绝';
    case ProposalStatus.DRAFT:
      return '草稿';
    default:
      return '未知';
  }
};

// 格式化日期显示
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN');
};
