'use client';

import { useI18n } from '@/contexts/I18nContext';

interface VotingRecord {
  id: string;
  proposalName: string;
  votingStage: string;
  myChoice: string;
  voteQuantity: string;
  voteDate: string;
}

interface VotingRecordsTableProps {
  className?: string;
}

export default function VotingRecordsTable({ className = '' }: VotingRecordsTableProps) {
  const { messages } = useI18n();
  
  // 模拟投票记录数据
  const votingRecords: VotingRecord[] = [
    {
      id: '1',
      proposalName: messages.votingRecords.sampleData.proposalName1,
      votingStage: messages.votingRecords.votingStages.milestoneDelivery,
      myChoice: messages.votingRecords.choices.approve,
      voteQuantity: '2,000,000 CKB',
      voteDate: '2025/09/18 00:00 (UTC+8)'
    },
    {
      id: '2',
      proposalName: messages.votingRecords.sampleData.proposalName2,
      votingStage: messages.votingRecords.votingStages.projectReview,
      myChoice: messages.votingRecords.choices.approve,
      voteQuantity: '5,000,000 CKB',
      voteDate: '2025/09/18 00:00 (UTC+8)'
    },
    {
      id: '3',
      proposalName: messages.votingRecords.sampleData.proposalName3,
      votingStage: messages.votingRecords.votingStages.finalDecision,
      myChoice: messages.votingRecords.choices.against,
      voteQuantity: '5,000,000 CKB',
      voteDate: '2025/09/18 00:00 (UTC+8)'
    }
  ];

  const getChoiceClass = (choice: string) => {
    const choiceMap: { [key: string]: string } = {
      [messages.votingRecords.choices.approve]: 'choice-approve',
      [messages.votingRecords.choices.against]: 'choice-against',
      [messages.votingRecords.choices.abstain]: 'choice-abstain'
    };
    return choiceMap[choice] || 'choice-default';
  };

  return (
    <div className={`voting-records-table ${className}`}>
      <div className="table-container">
        <table className="records-table">
          <thead>
            <tr>
              <th>{messages.votingRecords.tableHeaders.proposal}</th>
              <th>{messages.votingRecords.tableHeaders.votingStage}</th>
              <th>{messages.votingRecords.tableHeaders.myChoice}</th>
              <th>{messages.votingRecords.tableHeaders.voteQuantity}</th>
              <th>{messages.votingRecords.tableHeaders.voteDate}</th>
            </tr>
          </thead>
          <tbody>
            {votingRecords.map((record) => (
              <tr key={record.id}>
                <td className="proposal-name">{record.proposalName}</td>
                <td className="voting-stage">{record.votingStage}</td>
                <td className={`my-choice ${getChoiceClass(record.myChoice)}`}>
                  {record.myChoice}
                </td>
                <td className="vote-quantity">{record.voteQuantity}</td>
                <td className="vote-date">{record.voteDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
