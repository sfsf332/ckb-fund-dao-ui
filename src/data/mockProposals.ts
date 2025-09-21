// 提案状态枚举
export enum ProposalStatus {
  DRAFT = 'draft',           // 草稿
  REVIEW = 'review',         // 社区审议中
  VOTE = 'vote',            // 投票中
  MILESTONE = 'milestone',   // 里程碑交付中
  APPROVED = 'approved',     // 已通过
  REJECTED = 'rejected',     // 已拒绝
  ENDED = 'ended'           // 结束
}

// 提案类型枚举
export enum ProposalType {
  DEVELOPMENT = 'development',  // 开发项目
  GOVERNANCE = 'governance',    // 治理规则
  ECOSYSTEM = 'ecosystem',      // 生态建设
  RESEARCH = 'research',        // 研究项目
  INFRASTRUCTURE = 'infrastructure' // 基础设施
}

// 提案接口
export interface Proposal {
  id: string;
  title: string;
  status: ProposalStatus;
  type: ProposalType;
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

// Mock 提案数据
export const mockProposals: Proposal[] = [
  {
    id: 'prop-001',
    title: 'Web5 DID 身份协议栈开发',
    status: ProposalStatus.MILESTONE,
    type: ProposalType.DEVELOPMENT,
    proposer: {
      name: 'John Chen',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qvqr...7q2h'
    },
    budget: 2000000,
    createdAt: '2024-07-15',
    description: '开发基于 CKB 的 Web5 DID 身份协议栈，包括 DID 解析器、验证器和 SDK',
    milestones: {
      current: 2,
      total: 4,
      progress: 50
    },
    category: '基础设施',
    tags: ['DID', 'Web5', '身份认证', 'SDK']
  },
  {
    id: 'prop-002',
    title: 'DAO 治理元规则修改提案 #5',
    status: ProposalStatus.REVIEW,
    type: ProposalType.GOVERNANCE,
    proposer: {
      name: 'Krrrrr',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qyqr...7q2h'
    },
    budget: 0,
    createdAt: '2024-07-20',
    description: '修改 DAO 治理规则，调整投票权重计算方式和提案通过门槛',
    category: '治理',
    tags: ['治理', '投票规则', 'DAO']
  },
  {
    id: 'prop-003',
    title: 'CKB-UTXO 全链游戏引擎',
    status: ProposalStatus.VOTE,
    type: ProposalType.DEVELOPMENT,
    proposer: {
      name: 'ckbtc',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qyqr...7q2h'
    },
    budget: 3000000,
    createdAt: '2024-07-18',
    description: '开发基于 CKB UTXO 模型的全链游戏引擎，支持复杂的游戏逻辑和状态管理',
    voting: {
      approve: 65,
      oppose: 35,
      totalVotes: 8300000
    },
    category: '游戏',
    tags: ['游戏引擎', 'UTXO', '全链游戏', '状态管理']
  },
  {
    id: 'prop-004',
    title: 'JoyID 生态集成激励计划',
    status: ProposalStatus.ENDED,
    type: ProposalType.ECOSYSTEM,
    proposer: {
      name: 'moe',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qyqr...7q2h'
    },
    budget: 2000000,
    createdAt: '2024-06-10',
    description: '为 JoyID 钱包生态集成提供激励，支持更多 DApp 接入',
    milestones: {
      current: 4,
      total: 4,
      progress: 100
    },
    category: '生态',
    tags: ['JoyID', '钱包', '生态激励', 'DApp']
  },
  {
    id: 'prop-005',
    title: 'Nervos 跨链桥安全审计',
    status: ProposalStatus.VOTE,
    type: ProposalType.INFRASTRUCTURE,
    proposer: {
      name: 'SecurityTeam',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qabc...9x8y'
    },
    budget: 500000,
    createdAt: '2024-07-22',
    description: '对 Nervos 跨链桥进行全面的安全审计，确保资金安全',
    voting: {
      approve: 78,
      oppose: 22,
      totalVotes: 12000000
    },
    category: '安全',
    tags: ['安全审计', '跨链桥', '资金安全']
  },
  {
    id: 'prop-006',
    title: 'CKB 虚拟机优化研究',
    status: ProposalStatus.MILESTONE,
    type: ProposalType.RESEARCH,
    proposer: {
      name: 'ResearchLab',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qdef...5z7w'
    },
    budget: 800000,
    createdAt: '2024-07-05',
    description: '研究 CKB 虚拟机性能优化方案，提升交易处理速度',
    milestones: {
      current: 3,
      total: 5,
      progress: 60
    },
    category: '研究',
    tags: ['CKB', '虚拟机', '性能优化', '研究']
  },
  {
    id: 'prop-007',
    title: 'Layer 2 扩容解决方案',
    status: ProposalStatus.REVIEW,
    type: ProposalType.INFRASTRUCTURE,
    proposer: {
      name: 'Layer2Dev',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qghi...3v4u'
    },
    budget: 1500000,
    createdAt: '2024-07-25',
    description: '开发基于 CKB 的 Layer 2 扩容解决方案，提升网络吞吐量',
    category: '扩容',
    tags: ['Layer2', '扩容', '吞吐量', '基础设施']
  },
  {
    id: 'prop-008',
    title: 'DeFi 协议集成激励',
    status: ProposalStatus.APPROVED,
    type: ProposalType.ECOSYSTEM,
    proposer: {
      name: 'DeFiBuilder',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qjkl...8m9n'
    },
    budget: 1200000,
    createdAt: '2024-06-28',
    description: '激励主流 DeFi 协议集成到 Nervos 生态',
    category: 'DeFi',
    tags: ['DeFi', '协议集成', '生态激励']
  },
  {
    id: 'prop-009',
    title: 'Layer 2 扩容解决方案研究',
    status: ProposalStatus.VOTE,
    type: ProposalType.RESEARCH,
    proposer: {
      name: 'Layer2Researcher',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1ql2r...5t6y'
    },
    budget: 800000,
    createdAt: '2024-07-26',
    description: '研究基于 CKB 的 Layer 2 扩容解决方案，提升网络吞吐量',
    voting: {
      approve: 72,
      oppose: 28,
      totalVotes: 9500000
    },
    category: '扩容',
    tags: ['Layer2', '扩容', '研究', '吞吐量']
  },
  {
    id: 'prop-010',
    title: 'Nervos 生态开发者工具包',
    status: ProposalStatus.VOTE,
    type: ProposalType.DEVELOPMENT,
    proposer: {
      name: 'DevToolsTeam',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qdev...7u8i'
    },
    budget: 1200000,
    createdAt: '2024-07-27',
    description: '开发 Nervos 生态开发者工具包，包括调试工具、测试框架和文档',
    voting: {
      approve: 85,
      oppose: 15,
      totalVotes: 15000000
    },
    category: '开发工具',
    tags: ['开发工具', 'SDK', '调试', '文档']
  },
  {
    id: 'prop-011',
    title: '社区治理规则优化提案',
    status: ProposalStatus.VOTE,
    type: ProposalType.GOVERNANCE,
    proposer: {
      name: 'GovernanceExpert',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qgov...9o0p'
    },
    budget: 0,
    createdAt: '2024-07-28',
    description: '优化社区治理规则，提高决策效率和透明度',
    voting: {
      approve: 58,
      oppose: 42,
      totalVotes: 6800000
    },
    category: '治理',
    tags: ['治理规则', '决策效率', '透明度']
  },
  {
    id: 'prop-012',
    title: 'CKB 网络性能监控系统',
    status: ProposalStatus.VOTE,
    type: ProposalType.INFRASTRUCTURE,
    proposer: {
      name: 'MonitorTeam',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qmon...1a2b'
    },
    budget: 600000,
    createdAt: '2024-07-29',
    description: '构建 CKB 网络性能监控系统，实时监控网络状态和性能指标',
    voting: {
      approve: 91,
      oppose: 9,
      totalVotes: 18000000
    },
    category: '监控',
    tags: ['网络监控', '性能指标', '实时监控']
  },
  // 社区审议阶段提案
  {
    id: 'prop-013',
    title: 'Nervos 生态基金投资策略调整',
    status: ProposalStatus.REVIEW,
    type: ProposalType.GOVERNANCE,
    proposer: {
      name: 'FundManager',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qfund...3c4d'
    },
    budget: 0,
    createdAt: '2024-07-30',
    description: '调整 Nervos 生态基金的投资策略，优化资金配置和风险控制',
    category: '投资策略',
    tags: ['生态基金', '投资策略', '风险控制', '资金配置']
  },
  {
    id: 'prop-014',
    title: 'CKB 主网升级提案 v2.1',
    status: ProposalStatus.REVIEW,
    type: ProposalType.INFRASTRUCTURE,
    proposer: {
      name: 'CoreDev',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qcore...5e6f'
    },
    budget: 0,
    createdAt: '2024-07-31',
    description: 'CKB 主网升级到 v2.1 版本，包含性能优化和新功能',
    category: '主网升级',
    tags: ['主网升级', '性能优化', '新功能', 'v2.1']
  },
  {
    id: 'prop-015',
    title: '开发者激励计划 2024 Q3',
    status: ProposalStatus.REVIEW,
    type: ProposalType.ECOSYSTEM,
    proposer: {
      name: 'EcoBuilder',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qeco...7g8h'
    },
    budget: 2500000,
    createdAt: '2024-08-01',
    description: '2024年第三季度开发者激励计划，支持更多开发者参与 Nervos 生态建设',
    category: '开发者激励',
    tags: ['开发者激励', 'Q3', '生态建设', '技术社区']
  },
  {
    id: 'prop-016',
    title: '跨链桥安全标准制定',
    status: ProposalStatus.REVIEW,
    type: ProposalType.GOVERNANCE,
    proposer: {
      name: 'SecurityCouncil',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qsec...9i0j'
    },
    budget: 0,
    createdAt: '2024-08-02',
    description: '制定 Nervos 生态跨链桥的安全标准和技术规范',
    category: '安全标准',
    tags: ['安全标准', '跨链桥', '技术规范', '安全审计']
  },
  // 更多投票阶段提案
  {
    id: 'prop-017',
    title: 'Nervos 社区治理代币发行',
    status: ProposalStatus.VOTE,
    type: ProposalType.GOVERNANCE,
    proposer: {
      name: 'TokenDesigner',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qtoken...1k2l'
    },
    budget: 0,
    createdAt: '2024-08-03',
    description: '发行 Nervos 社区治理代币，增强社区治理参与度',
    voting: {
      approve: 67,
      oppose: 33,
      totalVotes: 11000000
    },
    category: '治理代币',
    tags: ['治理代币', '社区治理', '代币发行', '参与度']
  },
  {
    id: 'prop-018',
    title: 'CKB 挖矿算法优化研究',
    status: ProposalStatus.VOTE,
    type: ProposalType.RESEARCH,
    proposer: {
      name: 'MiningExpert',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qmining...3m4n'
    },
    budget: 900000,
    createdAt: '2024-08-04',
    description: '研究 CKB 挖矿算法优化方案，提高挖矿效率和公平性',
    voting: {
      approve: 74,
      oppose: 26,
      totalVotes: 13500000
    },
    category: '挖矿优化',
    tags: ['挖矿算法', '效率优化', '公平性', '研究']
  },
  {
    id: 'prop-019',
    title: 'Nervos 生态 DApp 孵化器',
    status: ProposalStatus.VOTE,
    type: ProposalType.ECOSYSTEM,
    proposer: {
      name: 'IncubatorTeam',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qinc...5o6p'
    },
    budget: 4000000,
    createdAt: '2024-08-05',
    description: '建立 Nervos 生态 DApp 孵化器，支持早期项目发展',
    voting: {
      approve: 82,
      oppose: 18,
      totalVotes: 16500000
    },
    category: '孵化器',
    tags: ['DApp孵化器', '早期项目', '生态支持', '创业孵化']
  },
  {
    id: 'prop-020',
    title: 'CKB 网络手续费机制改革',
    status: ProposalStatus.VOTE,
    type: ProposalType.GOVERNANCE,
    proposer: {
      name: 'FeeOptimizer',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qfee...7q8r'
    },
    budget: 0,
    createdAt: '2024-08-06',
    description: '改革 CKB 网络手续费机制，优化用户体验和网络效率',
    voting: {
      approve: 59,
      oppose: 41,
      totalVotes: 7200000
    },
    category: '手续费机制',
    tags: ['手续费', '用户体验', '网络效率', '机制改革']
  },
  {
    id: 'prop-021',
    title: 'Nervos 生态数据分析和报告系统',
    status: ProposalStatus.VOTE,
    type: ProposalType.DEVELOPMENT,
    proposer: {
      name: 'DataAnalyst',
      avatar: '/avatar.jpg',
      did: 'did:ckb:ckt1qdata...9s0t'
    },
    budget: 1500000,
    createdAt: '2024-08-07',
    description: '开发 Nervos 生态数据分析和报告系统，提供生态发展洞察',
    voting: {
      approve: 88,
      oppose: 12,
      totalVotes: 19500000
    },
    category: '数据分析',
    tags: ['数据分析', '报告系统', '生态洞察', '数据可视化']
  }
];

// 获取提案统计信息
export const getProposalStats = () => {
  const stats = {
    total: mockProposals.length,
    pending: 0,
    totalBudget: 0,
    pendingBudget: 0
  };

  mockProposals.forEach(proposal => {
    if (proposal.status === ProposalStatus.REVIEW || proposal.status === ProposalStatus.VOTE) {
      stats.pending++;
      stats.pendingBudget += proposal.budget;
    }
    stats.totalBudget += proposal.budget;
  });

  return stats;
};

// 根据状态筛选提案
export const getProposalsByStatus = (status: ProposalStatus) => {
  return mockProposals.filter(proposal => proposal.status === status);
};

// 根据类型筛选提案
export const getProposalsByType = (type: ProposalType) => {
  return mockProposals.filter(proposal => proposal.type === type);
};
