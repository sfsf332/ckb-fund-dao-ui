'use client';

import { useState } from 'react';
import VotingRecordsTable from './VotingRecordsTable';
import DiscussionRecordsTable from './DiscussionRecordsTable';

interface RecordsTableProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
}

interface ProposalRecord {
  id: string;
  name: string;
  type: string;
  budget: string;
  status: string;
  publishDate: string;
  actions: string[];
}

export default function RecordsTable({ activeTab, setActiveTab, className = '' }: RecordsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  // 模拟数据
  const proposalRecords: ProposalRecord[] = [
    {
      id: '1',
      name: '提案名称1',
      type: '项目预算申请',
      budget: '2,000,000 CKB',
      status: '社区审议中',
      publishDate: '2025/09/18 00:00 (UTC+8)',
      actions: ['编辑', '开启投票']
    },
    {
      id: '2',
      name: '提案名称2',
      type: '项目预算申请',
      budget: '5,000,000 CKB',
      status: '里程碑交付中',
      publishDate: '2025/09/18 00:00 (UTC+8)',
      actions: ['里程碑交付']
    },
    {
      id: '3',
      name: '提案名称3',
      type: '项目预算申请',
      budget: '5,000,000 CKB',
      status: '项目复核',
      publishDate: '2025/09/18 00:00 (UTC+8)',
      actions: ['整改完成']
    },
    {
      id: '4',
      name: '提案名称4',
      type: '项目预算申请',
      budget: '5,000,000 CKB',
      status: '终止',
      publishDate: '2025/09/18 00:00 (UTC+8)',
      actions: []
    },
    {
      id: '5',
      name: '提案名称5',
      type: '项目预算申请',
      budget: '5,000,000 CKB',
      status: '结项',
      publishDate: '2025/09/18 00:00 (UTC+8)',
      actions: []
    }
  ];

  const tabs = [
    { key: 'proposals', label: '提案记录' },
    { key: 'voting', label: '投票纪录' },
    { key: 'discussion', label: '讨论记录' }
  ];

  const getStatusClass = (status: string) => {
    const statusMap: { [key: string]: string } = {
      '社区审议中': 'status-review',
      '里程碑交付中': 'status-delivery',
      '项目复核': 'status-review',
      '终止': 'status-terminated',
      '结项': 'status-closed'
    };
    return statusMap[status] || 'status-default';
  };

  const handleAction = (action: string, recordId: string) => {
    console.log(`执行操作: ${action}, 记录ID: ${recordId}`);
  };

  const renderTableContent = () => {
    switch (activeTab) {
      case 'voting':
        return <VotingRecordsTable />;
      case 'discussion':
        return <DiscussionRecordsTable />;
      case 'proposals':
      default:
        return (
          <>
            <div className="table-container">
              <table className="records-table">
                <thead>
                  <tr>
                    <th>提案</th>
                    <th>类型</th>
                    <th>申请预算</th>
                    <th>提案状态</th>
                    <th>发布日期</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {proposalRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="proposal-name">{record.name}</td>
                      <td className="proposal-type">{record.type}</td>
                      <td className="proposal-budget">{record.budget}</td>
                      <td className="proposal-status">
                        <span className={`status-tag ${getStatusClass(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="proposal-date">{record.publishDate}</td>
                      <td className="proposal-actions">
                        {record.actions.map((action, index) => (
                          <button
                            key={index}
                            className={`action-button ${action === '整改完成' ? 'filled' : 'outlined'}`}
                            onClick={() => handleAction(action, record.id)}
                          >
                            {action}
                          </button>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                &lt;
              </button>
              <span className="pagination-info">
                {currentPage} / {totalPages}
              </span>
              <button
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                &gt;
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className={`records-table-container ${className}`}>
      <div className="records-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTableContent()}
    </div>
  );
}
