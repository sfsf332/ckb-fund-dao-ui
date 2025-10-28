'use client';

import { useState } from 'react';
import Tag from "@/components/ui/tag/Tag";
import { ProposalStatus } from "@/utils/proposalUtils";
import VotingRecordsTable from './VotingRecordsTable';
import DiscussionRecordsTable from './DiscussionRecordsTable';
import { useI18n } from '@/contexts/I18nContext';

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
  const { messages } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  // 将字符串状态转换为ProposalStatus枚举
  const getStatusFromString = (status: string): ProposalStatus => {
    switch (status) {
      case messages.recordsTable.proposalStatuses.underReview:
        return ProposalStatus.REVIEW;
      case messages.recordsTable.proposalStatuses.voting:
        return ProposalStatus.VOTE;
      case messages.recordsTable.proposalStatuses.milestoneDelivery:
        return ProposalStatus.MILESTONE;
      case messages.recordsTable.proposalStatuses.approved:
        return ProposalStatus.APPROVED;
      case messages.recordsTable.proposalStatuses.rejected:
        return ProposalStatus.REJECTED;
      case messages.recordsTable.proposalStatuses.ended:
        return ProposalStatus.ENDED;
      case messages.recordsTable.proposalStatuses.draft:
        return ProposalStatus.DRAFT;
      default:
        return ProposalStatus.REVIEW;
    }
  };

  // 模拟数据
  const proposalRecords: ProposalRecord[] = [
    {
      id: '1',
      name: messages.recordsTable.sampleData.proposalName1,
      type: messages.recordsTable.proposalTypes.budgetApplication,
      budget: '2,000,000 CKB',
      status: messages.recordsTable.proposalStatuses.underReview,
      publishDate: '2025/09/18 00:00 (UTC+8)',
      actions: [messages.recordsTable.actions.edit, messages.recordsTable.actions.startVoting]
    },
    {
      id: '2',
      name: messages.recordsTable.sampleData.proposalName2,
      type: messages.recordsTable.proposalTypes.budgetApplication,
      budget: '5,000,000 CKB',
      status: messages.recordsTable.proposalStatuses.milestoneDelivery,
      publishDate: '2025/09/18 00:00 (UTC+8)',
      actions: [messages.recordsTable.actions.milestoneDelivery]
    },
    {
      id: '3',
      name: messages.recordsTable.sampleData.proposalName3,
      type: messages.recordsTable.proposalTypes.budgetApplication,
      budget: '5,000,000 CKB',
      status: messages.recordsTable.proposalStatuses.projectReview,
      publishDate: '2025/09/18 00:00 (UTC+8)',
      actions: [messages.recordsTable.actions.rectificationComplete]
    },
    {
      id: '4',
      name: messages.recordsTable.sampleData.proposalName4,
      type: messages.recordsTable.proposalTypes.budgetApplication,
      budget: '5,000,000 CKB',
      status: messages.recordsTable.proposalStatuses.terminated,
      publishDate: '2025/09/18 00:00 (UTC+8)',
      actions: []
    },
    {
      id: '5',
      name: messages.recordsTable.sampleData.proposalName5,
      type: messages.recordsTable.proposalTypes.budgetApplication,
      budget: '5,000,000 CKB',
      status: messages.recordsTable.proposalStatuses.completed,
      publishDate: '2025/09/18 00:00 (UTC+8)',
      actions: []
    }
  ];

  const tabs = [
    { key: 'proposals', label: messages.recordsTable.tabs.proposals },
    { key: 'voting', label: messages.recordsTable.tabs.voting },
    { key: 'discussion', label: messages.recordsTable.tabs.discussion }
  ];

  

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
                    <th>{messages.recordsTable.tableHeaders.proposal}</th>
                    <th>{messages.recordsTable.tableHeaders.type}</th>
                    <th>{messages.recordsTable.tableHeaders.budget}</th>
                    <th>{messages.recordsTable.tableHeaders.status}</th>
                    <th>{messages.recordsTable.tableHeaders.publishDate}</th>
                    <th>{messages.recordsTable.tableHeaders.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {proposalRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="proposal-name">{record.name}</td>
                      <td className="proposal-type">{record.type}</td>
                      <td className="proposal-budget">{record.budget}</td>
                      <td className="proposal-status">
                        <Tag status={getStatusFromString(record.status)} size="sm" />
                      </td>
                      <td className="proposal-date">{record.publishDate}</td>
                      <td className="proposal-actions">
                        {record.actions.map((action, index) => (
                          <button
                            key={index}
                            className={`action-button ${action === messages.recordsTable.actions.rectificationComplete ? 'filled' : 'outlined'}`}
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
