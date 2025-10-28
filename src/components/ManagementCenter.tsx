"use client";

import { useState, useEffect, useMemo } from "react";
import { ProposalStatus } from "@/utils/proposalUtils";
import TaskProcessingModal, { TaskType } from "./TaskProcessingModal";
import Tag from "./ui/tag/Tag";
import { useProposalList } from "@/hooks/useProposalList";
import { ProposalListItem } from "@/server/proposal";
import useUserInfoStore from "@/store/userInfo";

interface ProposalItem {
  id: string;
  name: string;
  type: string;
  status: ProposalStatus;
  taskType: TaskType;
  deadline: string;
  isNew?: boolean;
  progress?: string;
  uri: string; // 添加uri字段用于跳转
  budget?: number; // 添加预算字段
}

// 根据提案状态和类型确定任务类型
const getTaskTypeByStatus = (status: ProposalStatus, proposalType: string): TaskType => {
  switch (status) {
    case ProposalStatus.REVIEW:
      if (proposalType === "项目预算申请") {
        return "组织AMA";
      }
      return "组织会议";
    case ProposalStatus.VOTE:
      return "发布会议纪要";
    case ProposalStatus.MILESTONE:
      // 根据里程碑状态确定具体任务
      return "里程碑核查";
    case ProposalStatus.APPROVED:
      return "里程碑拨款";
    default:
      return "组织会议";
  }
};

// 根据提案状态确定截止日期
const getDeadlineByStatus = (status: ProposalStatus, createdAt: string): string => {
  const createdDate = new Date(createdAt);
  
  switch (status) {
    case ProposalStatus.REVIEW:
      // 审议期7天
      const reviewDeadline = new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      return reviewDeadline.toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Shanghai'
      }) + ' (UTC+8)';
    case ProposalStatus.VOTE:
      // 投票期3天
      const voteDeadline = new Date(createdDate.getTime() + 10 * 24 * 60 * 60 * 1000);
      return voteDeadline.toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Shanghai'
      }) + ' (UTC+8)';
    case ProposalStatus.MILESTONE:
      // 里程碑交付期30天
      const milestoneDeadline = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      return milestoneDeadline.toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Shanghai'
      }) + ' (UTC+8)';
    default:
      return "待定";
  }
};

// 将API数据转换为ManagementCenter需要的格式
const adaptProposalData = (proposal: ProposalListItem): ProposalItem => {
  const status = proposal.state as ProposalStatus;
  const proposalType = proposal.record.data.proposalType;
  
  return {
    id: proposal.cid,
    name: proposal.record.data.title,
    type: proposalType,
    status: status,
    taskType: getTaskTypeByStatus(status, proposalType),
    deadline: getDeadlineByStatus(status, proposal.record.created),
    isNew: false, // 可以根据创建时间判断是否为新提案
    uri: proposal.uri,
    budget: parseFloat(proposal.record.data.budget) || 0, // 添加预算字段
  };
};

const filterOptions = [
  { key: "all", label: "全部", count: 0 },
  { key: "ama", label: "组织AMA", count: 0 },
  { key: "milestone", label: "里程碑审核", count: 0 },
  { key: "allocation", label: "待拨款", count: 0 },
  { key: "completion", label: "待结项", count: 0 },
];

export default function ManagementCenter() {
  const { userInfo } = useUserInfoStore();
  const [activeTab, setActiveTab] = useState("pending");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem | undefined>(undefined);

  // 使用真实的提案数据
  const { proposals: rawProposals, loading, error, refetch } = useProposalList({
    cursor: null,
    limit: 50,
    viewer: userInfo?.did || null,
  });

  // 转换数据格式
  const proposals = useMemo(() => {
    return rawProposals.map(adaptProposalData);
  }, [rawProposals]);

  // 计算筛选选项的计数
  const filterCounts = useMemo(() => {
    const counts = {
      all: proposals.length,
      ama: proposals.filter(p => p.taskType === "组织AMA").length,
      milestone: proposals.filter(p => p.taskType === "里程碑核查").length,
      allocation: proposals.filter(p => p.taskType === "里程碑拨款").length,
      completion: proposals.filter(p => p.taskType === "发布结项报告").length,
    };
    
    return filterOptions.map(option => ({
      ...option,
      count: counts[option.key as keyof typeof counts] || 0
    }));
  }, [proposals]);

  // 根据筛选条件过滤提案
  const filteredProposals = useMemo(() => {
    let filtered = proposals;

    // 根据标签页过滤
    if (activeTab === "new") {
      filtered = filtered.filter(p => p.isNew);
    } else if (activeTab === "pending") {
      filtered = filtered.filter(p => 
        p.status === ProposalStatus.REVIEW || 
        p.status === ProposalStatus.VOTE || 
        p.status === ProposalStatus.MILESTONE
      );
    }

    // 根据筛选器过滤
    if (activeFilter !== "all") {
      switch (activeFilter) {
        case "ama":
          filtered = filtered.filter(p => p.taskType === "组织AMA");
          break;
        case "milestone":
          filtered = filtered.filter(p => p.taskType === "里程碑核查");
          break;
        case "allocation":
          filtered = filtered.filter(p => p.taskType === "里程碑拨款");
          break;
        case "completion":
          filtered = filtered.filter(p => p.taskType === "发布结项报告");
          break;
      }
    }

    // 根据搜索查询过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query) ||
        p.taskType.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [proposals, activeTab, activeFilter, searchQuery]);

  // 标记新提案（创建时间在24小时内的）
  useEffect(() => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    proposals.forEach(proposal => {
      const createdDate = new Date(rawProposals.find(p => p.cid === proposal.id)?.record.created || '');
      proposal.isNew = createdDate > oneDayAgo;
    });
  }, [proposals, rawProposals]);


  const handleTaskProcess = (proposal: ProposalItem) => {
    setSelectedProposal(proposal);
    setShowTaskModal(true);
  };

  const handleCreateVote = (proposal: ProposalItem) => {
    setSelectedProposal({ ...proposal, taskType: "创建投票" });
    setShowTaskModal(true);
  };

  const handleTaskComplete = (data: unknown) => {
    console.log("任务完成数据:", data);
    
    // 如果是投票创建任务，刷新提案列表
    if (selectedProposal?.taskType === "创建投票") {
      console.log("投票创建成功，刷新提案列表");
      refetch();
    }
    
    setShowTaskModal(false);
    setSelectedProposal(undefined);
  };

  const handleTaskModalClose = () => {
    setShowTaskModal(false);
    setSelectedProposal(undefined);
  };

  return (
    <div className="management-center">
      {/* 顶部标签页 */}
      <div className="management-tabs">
        <button
          className={`tab-button ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          待处理
        </button>
        <button
          className={`tab-button ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          新提案
          <span className="badge">{proposals.filter(p => p.isNew).length}</span>
        </button>
      </div>

      {/* 筛选按钮 */}
      <div className="filter-section">
        <div className="filter-buttons">
          {filterCounts.map((option) => (
            <button
              key={option.key}
              className={`filter-button ${
                activeFilter === option.key ? "active" : ""
              }`}
              onClick={() => setActiveFilter(option.key)}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>

        {/* 搜索框 */}
        <div className="search-section">
          <input
            type="search"
            placeholder="搜索提案"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="management-search-input"
          />
        </div>
      </div>

      {/* 提案表格 */}
      <div className="proposals-table">
        {loading ? (
          <div className="loading-state">
            <p>加载中...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>加载失败: {error}</p>
            <button onClick={() => refetch()}>重试</button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>提案名称</th>
                <th>类型</th>
                <th>提案状态</th>
                <th>任务类型</th>
                <th>截止日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data">
                    暂无数据
                  </td>
                </tr>
              ) : (
                filteredProposals.map((proposal) => (
                  <tr key={proposal.id}>
                    <td>
                      <div className="proposal-name">
                        {proposal.name}
                        {proposal.isNew && <span className="new-tag">NEW</span>}
                      </div>
                    </td>
                    <td>{proposal.type}</td>
                    <td>
                      <Tag 
                        status={proposal.status}
                        size="sm" 
                      />
                    </td>
                    <td>{proposal.taskType}</td>
                    <td>{proposal.deadline}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="task-action-button"
                          onClick={() => handleTaskProcess(proposal)}
                        >
                          处理
                        </button>
                        {proposal.status === ProposalStatus.REVIEW && (
                          <button 
                            className="vote-action-button"
                            onClick={() => handleCreateVote(proposal)}
                          >
                            创建投票
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 任务处理Modal */}
      <TaskProcessingModal
        isOpen={showTaskModal}
        onClose={handleTaskModalClose}
        onComplete={handleTaskComplete}
        taskType={selectedProposal?.taskType}
        proposal={selectedProposal}
      />
    </div>
  );
}
