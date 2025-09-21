'use client';

import { MilestoneTrackingProps, MilestoneStatus } from '../../types/milestone';
import MilestoneVoting from './MilestoneVoting';
import { MilestoneVoteOption } from '../../types/milestoneVoting';
import './milestone.css';

export default function MilestoneTracking({ 
  milestones, 
  currentMilestone, // eslint-disable-line @typescript-eslint/no-unused-vars
  totalMilestones, // eslint-disable-line @typescript-eslint/no-unused-vars
  className = '' 
}: MilestoneTrackingProps) {

  // 处理里程碑投票
  const handleMilestoneVote = (milestoneId: string, option: MilestoneVoteOption) => {
    console.log(`里程碑 ${milestoneId} 投票:`, option);
    // TODO: 这里应该调用实际的投票API
  };
  
  // 获取里程碑状态样式
  const getMilestoneStatusClass = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.COMPLETED:
        return 'milestone-completed';
      case MilestoneStatus.IN_PROGRESS:
        return 'milestone-in-progress';
      case MilestoneStatus.CANCELLED:
        return 'milestone-cancelled';
      default:
        return 'milestone-pending';
    }
  };

  // 获取里程碑状态文本
  const getMilestoneStatusText = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.COMPLETED:
        return '已完成';
      case MilestoneStatus.IN_PROGRESS:
        return '进行中';
      case MilestoneStatus.CANCELLED:
        return '已取消';
      default:
        return '待开始';
    }
  };

  // 获取里程碑图标
  const getMilestoneIcon = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.COMPLETED:
        return '✓';
      case MilestoneStatus.IN_PROGRESS:
        return '●';
      case MilestoneStatus.CANCELLED:
        return '✗';
      default:
        return '○';
    }
  };

  return (
    <div className={`milestone-tracking-card ${className}`}>
      <h3 className="milestone-title">里程碑追踪</h3>
      <div className="milestone-list">
        {milestones.map((milestone) => (
          <div 
            key={milestone.id} 
            className={`milestone-item ${getMilestoneStatusClass(milestone.status)}`}
          >
            <div className="milestone-icon">
              {getMilestoneIcon(milestone.status)}
            </div>
            <div className="milestone-content">
              <div className="milestone-header">
                <span className="milestone-title-text">{milestone.title}</span>
                <span className={`milestone-status-badge ${getMilestoneStatusClass(milestone.status)}`}>
                  {getMilestoneStatusText(milestone.status)}
                </span>
              </div>
              
              {/* 进度条 - 仅在进行中状态显示 */}
              {/* {milestone.status === MilestoneStatus.IN_PROGRESS && (
                <div className="milestone-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{milestone.progress}%</span>
                </div>
              )} */}
              
 
            </div>
          </div>
        ))}
      </div>

      {/* 里程碑投票区域 */}
      <div className="milestone-voting-section">
        {milestones
          .filter(milestone => milestone.votingInfo && milestone.status === MilestoneStatus.IN_PROGRESS)
          .map((milestone) => (
            <MilestoneVoting
              key={`voting-${milestone.id}`}
              votingInfo={milestone.votingInfo!}
              onVote={handleMilestoneVote}
              className="milestone-voting-item"
            />
          ))}
      </div>
    </div>
  );
}
