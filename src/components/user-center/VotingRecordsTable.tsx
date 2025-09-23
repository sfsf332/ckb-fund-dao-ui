'use client';

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
  // 模拟投票记录数据
  const votingRecords: VotingRecord[] = [
    {
      id: '1',
      proposalName: '提案名称1',
      votingStage: '里程碑交付-里程碑1',
      myChoice: '赞成',
      voteQuantity: '2,000,000 CKB',
      voteDate: '2025/09/18 00:00 (UTC+8)'
    },
    {
      id: '2',
      proposalName: '提案名称2',
      votingStage: '项目复核投票',
      myChoice: '赞成',
      voteQuantity: '5,000,000 CKB',
      voteDate: '2025/09/18 00:00 (UTC+8)'
    },
    {
      id: '3',
      proposalName: '提案名称3',
      votingStage: '最终裁决投票',
      myChoice: '反对',
      voteQuantity: '5,000,000 CKB',
      voteDate: '2025/09/18 00:00 (UTC+8)'
    }
  ];

  const getChoiceClass = (choice: string) => {
    const choiceMap: { [key: string]: string } = {
      '赞成': 'choice-approve',
      '反对': 'choice-against',
      '弃权': 'choice-abstain'
    };
    return choiceMap[choice] || 'choice-default';
  };

  return (
    <div className={`voting-records-table ${className}`}>
      <div className="table-container">
        <table className="records-table">
          <thead>
            <tr>
              <th>提案</th>
              <th>投票阶段</th>
              <th>我的选择</th>
              <th>投票数量</th>
              <th>投票日期</th>
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
