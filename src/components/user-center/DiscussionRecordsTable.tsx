'use client';

interface DiscussionRecord {
  id: string;
  commentDate: string;
  proposalName: string;
  commentContent: string;
  userName?: string;
  userAvatar?: string;
  isReply?: boolean;
  parentCommentId?: string;
}

interface DiscussionRecordsTableProps {
  className?: string;
}

export default function DiscussionRecordsTable({ className = '' }: DiscussionRecordsTableProps) {
  // 模拟讨论记录数据，基于设计图中的内容
  const discussionRecords: DiscussionRecord[] = [
    {
      id: '1',
      commentDate: '2025/09/18 00:00',
      proposalName: 'CKB-UTXO 全链游戏引擎',
      commentContent: '这个全链游戏引擎的想法很棒!请问你们打算如何解决状态爆炸的问题?这是UTXO 模型在复杂应用中常见的挑战。'
    },
    {
      id: '2',
      commentDate: '2025/09/18 00:00',
      proposalName: 'CKB-UTXO 全链游戏引擎',
      commentContent: 'if the vote would fail because of that I would suggest an extended time period to vote, now people are probably not aware of the need for an increased number of votes.',
      userName: 'Altruistic',
      userAvatar: '🧡'
    },
    {
      id: '3',
      commentDate: '2025/09/18 00:00',
      proposalName: 'CKB-UTXO 全链游戏引擎',
      commentContent: 'Hi telmobit, in the CKB Community Fund DAO Rules and Process, it is written that the proposal requires to "allow sufficient time (one week) to help the community fully understand the proposal and provide feedback."',
      userName: 'Altruistic',
      userAvatar: '🧡',
      isReply: true,
      parentCommentId: '2'
    },
    {
      id: '4',
      commentDate: '2025/09/18 00:00',
      proposalName: 'CKB-UTXO 全链游戏引擎',
      commentContent: '这个全链游戏引擎的想法很棒!'
    },
    {
      id: '5',
      commentDate: '2025/09/18 00:00',
      proposalName: 'CKB-UTXO 全链游戏引擎',
      commentContent: '这个全链游戏引擎的想法很棒!请问你们打算如何解决状态爆炸的问题?这是UTXO 模型在复杂应用中常见的挑战。'
    }
  ];


  return (
    <div className={`discussion-records-list ${className}`}>
      <div className="discussion-list">
        {discussionRecords.map((record) => (
          <div key={record.id} className={`discussion-item ${record.isReply ? 'reply-item' : ''}`}>
            <div className="discussion-header">
              <span className="comment-date">{record.commentDate}</span>
              <span className="proposal-reference">
                在提案 <span className="proposal-link">{record.proposalName}</span> 中评论:
              </span>
            </div>
            <div className="discussion-content">
              {record.isReply && <div className="reply-indicator"></div>}
              <div className="comment-block">
                {record.userAvatar && record.userName && (
                  <div className="user-info" style={{justifyContent:"flex-start"}}>
                    <span className="user-avatar">{record.userAvatar}</span>
                    <span className="user-name">{record.userName}</span>
                  </div>
                )}
                <div className="comment-text">{record.commentContent}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
