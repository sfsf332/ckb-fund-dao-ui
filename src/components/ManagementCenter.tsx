"use client";

import { useState } from "react";
import { ProposalStatus } from "@/utils/proposalUtils";
import TaskProcessingModal, { TaskType } from "./TaskProcessingModal";
import Tag from "./ui/tag/Tag";

interface ProposalItem {
  id: string;
  name: string;
  type: string;
  status: ProposalStatus;
  taskType: TaskType;
  deadline: string;
  isNew?: boolean;
  progress?: string;
}

const mockProposals: ProposalItem[] = [
  {
    id: "1",
    name: "提案名称 1",
    type: "项目预算申请",
    status: ProposalStatus.REVIEW,
    taskType: "组织AMA",
    deadline: "2025/09/18 00:00 (UTC+8)",
  },
  {
    id: "2",
    name: "提案名称 2",
    type: "项目预算申请",
    status: ProposalStatus.REVIEW,
    taskType: "发布会议纪要",
    deadline: "2025/09/18 00:00 (UTC+8)",
    isNew: true,
  },
  {
    id: "3",
    name: "提案名称 3",
    type: "元规则修改",
    status: ProposalStatus.REVIEW,
    taskType: "里程碑拨款",
    deadline: "2025/09/18 00:00 (UTC+8)",
  },
  {
    id: "4",
    name: "提案名称 4",
    type: "项目预算申请",
    status: ProposalStatus.MILESTONE,
    taskType: "里程碑核查",
    deadline: "2025/09/18 00:00 (UTC+8)",
  },
  {
    id: "5",
    name: "提案名称 5",
    type: "项目预算申请",
    status: ProposalStatus.MILESTONE,
    taskType: "项目整改核查",
    deadline: "2025/09/18 00:00 (UTC+8)",
  },
  {
    id: "6",
    name: "提案名称 6",
    type: "项目预算申请",
    status: ProposalStatus.MILESTONE,
    taskType: "回收项目资金",
    deadline: "2025/09/18 00:00 (UTC+8)",
  },
  {
    id: "7",
    name: "提案名称 7",
    type: "项目预算申请",
    status: ProposalStatus.MILESTONE,
    taskType: "发布结项报告",
    deadline: "2025/09/18 00:00 (UTC+8)",
  },
];

const filterOptions = [
  { key: "all", label: "全部", count: 12 },
  { key: "ama", label: "组织AMA", count: 3 },
  { key: "milestone", label: "里程碑审核", count: 3 },
  { key: "allocation", label: "待拨款", count: 4 },
  { key: "completion", label: "待结项", count: 1 },
];

export default function ManagementCenter() {
  const [activeTab, setActiveTab] = useState("pending");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [proposals] = useState<ProposalItem[]>(mockProposals);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem | null>(null);


  const handleTaskProcess = (proposal: ProposalItem) => {
    setSelectedProposal(proposal);
    setShowTaskModal(true);
  };

  const handleTaskComplete = (data: { meetingTime: string; meetingLocation: string; meetingLink: string; remarks: string }) => {
    console.log("任务完成数据:", data);
    // 这里可以处理任务完成逻辑
    setShowTaskModal(false);
    setSelectedProposal(null);
  };

  const handleTaskModalClose = () => {
    setShowTaskModal(false);
    setSelectedProposal(null);
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
          <span className="badge">1</span>
        </button>
      </div>

      {/* 筛选按钮 */}
      <div className="filter-section">
        <div className="filter-buttons">
          {filterOptions.map((option) => (
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
            {proposals.map((proposal) => (
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
                  <button 
                    className="task-action-button"
                    onClick={() => handleTaskProcess(proposal)}
                  >
                    处理
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 任务处理Modal */}
      <TaskProcessingModal
        isOpen={showTaskModal}
        onClose={handleTaskModalClose}
        onComplete={handleTaskComplete}
        taskType={selectedProposal?.taskType}
      />
    </div>
  );
}
