
// 格式化数字显示
export const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN');
};
// 提案状态枚举
export enum ProposalStatus {
  DRAFT = 1,           // 草稿
  REVIEW = 2,         // 社区审议中
  VOTE = 3,            // 投票中
  MILESTONE = 1001,   // 里程碑交付中
  APPROVED = 4,     // 已通过
  REJECTED = 5,     // 已拒绝
  ENDED = 0           // 结束
}
// 提案接口
export interface Proposal {
  id: string;
  title: string;
  type: ProposalType;
  state: ProposalStatus;
  proposer: {
    name: string;
    avatar: string;
    did: string;
  };
  budget: number; // CKB 数量
  createdAt: string;
  description: string;
  milestones?: {
    current: number;
    total: number;
    progress: number; // 百分比
  };
  voting?: {
    approve: number; // 赞成票百分比
    oppose: number;  // 反对票百分比
    totalVotes: number; // 总投票数
  };
  category: string;
  tags: string[];
}

// 提案类型枚举
export enum ProposalType {
  DEVELOPMENT = 'development',  // 开发项目
  GOVERNANCE = 'governance',    // 治理规则
  ECOSYSTEM = 'ecosystem',      // 生态建设
  RESEARCH = 'research',        // 研究项目
  INFRASTRUCTURE = 'infrastructure' // 基础设施
}
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
