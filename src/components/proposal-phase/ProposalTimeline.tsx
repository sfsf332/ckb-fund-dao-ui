'use client';

import { TimelineEventStatus, ProposalTimelineProps } from '../../types/timeline';
import { formatDate } from '../../utils/proposalUtils';
import { useI18n } from '@/contexts/I18nContext';
import './timeline.css';

export default function ProposalTimeline({ events, className = '' }: ProposalTimelineProps) {
  const { messages } = useI18n();

  // 获取事件状态样式
  const getEventStatusClass = (status: TimelineEventStatus) => {
    switch (status) {
      case TimelineEventStatus.COMPLETED:
        return 'timeline-event-completed';
      case TimelineEventStatus.IN_PROGRESS:
        return 'timeline-event-in-progress';
      case TimelineEventStatus.CANCELLED:
        return 'timeline-event-cancelled';
      default:
        return 'timeline-event-pending';
    }
  };


  // 按日期排序事件（最新的在前）
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className={`timeline-card ${className}`}>
      <h3 className="timeline-title">{messages.proposalPhase.proposalTimeline.title}</h3>
      <div className="timeline">
        {sortedEvents.map((event) => (
          <div 
            key={event.id} 
            className={`timeline-item ${getEventStatusClass(event.status)}`}
          >
            <div className={`timeline-dot ${event.status === TimelineEventStatus.IN_PROGRESS ? 'timeline-dot-active' : ''}`}>
            </div>
            <div className="timeline-content">
              <div className="timeline-event">
                {event.title}
              </div>
              <div className="timeline-date">
                {formatDate(event.date)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
