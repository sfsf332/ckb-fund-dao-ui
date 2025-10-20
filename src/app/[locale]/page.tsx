'use client';

import 'react-tooltip/dist/react-tooltip.css'
import ProposalItem from "../../components/ProposalItem";
import { useProposalList } from "../../hooks/useProposalList";
import useUserInfoStore from "@/store/userInfo";
import { useEffect, useRef, useState } from "react";
import { ProposalStatus } from "@/utils/proposalUtils";
import UserGovernance from "@/components/UserGovernance";
import TreasuryOverview from "@/components/TreasuryOverview";

export default function Treasury() {
  const { userInfo } = useUserInfoStore();
  // 使用hooks获取提案列表
  const { proposals, loading: proposalsLoading, error: proposalsError, refetch, loadMore, hasMore } = useProposalList({
    cursor: null,
    limit: 2,
    viewer: userInfo?.did || null,
  });

  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const sentinel = loadMoreRef.current;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (hasMore && !proposalsLoading) {
          loadMore();
        }
      }
    }, { rootMargin: '200px 0px' });
    observer.observe(sentinel);
    return () => observer.unobserve(sentinel);
  }, [hasMore, proposalsLoading, loadMore]);

  // 加载与错误状态改为仅在列表区域显示

  return (
    <div className="container">
      <main>
        {/* <ul className="dao_info">
          <li>
            <h3>申请中提案</h3>
            <p>{stats.pending}</p>
          </li>
          <li>
            <h3>总申请预算</h3>
            <p>{formatNumber(stats.totalBudget)} CKB</p>
          </li>
          <li>
            <h3>待拨款提案</h3>
            <p>{stats.pending}</p>
          </li>
          <li>
            <h3>待拨款预算</h3>
            <p>{formatNumber(stats.pendingBudget)} CKB</p>
          </li>
        </ul> */}
        <div className="proposal_list_container">
        <section className="proposal_list">
          <nav>
            <h3>提案列表</h3>
            <div className="nav-controls">
              {/* <input type="search" placeholder="搜索提案" /> */}
              <select
                name="proposal-status-filter"
                id="proposal-status-filter"
                value={selectedStatus}
                onChange={async (e) => {
                  const value = e.target.value;
                  setSelectedStatus(value);
                  await refetch({
                    cursor: null,
                    limit: 20,
                    viewer: userInfo?.did || null,
                  });
                }}
              >
                <option value="">全部</option>
                <option value={String(ProposalStatus.REVIEW)}>社区审议中</option>
                <option value={String(ProposalStatus.VOTE)}>投票中</option>
                <option value={String(ProposalStatus.MILESTONE)}>里程碑交付中</option>
                <option value={String(ProposalStatus.APPROVED)}>已通过</option>
                <option value={String(ProposalStatus.REJECTED)}>已拒绝</option>
                <option value={String(ProposalStatus.DRAFT)}>草稿</option>
                <option value={String(ProposalStatus.ENDED)}>结束</option>
              </select>
            </div>
          </nav>
          
          <ul className="proposal_list_content">
            {proposalsError ? (
              <li style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                加载失败: {proposalsError}
              </li>
            ) : proposals.length > 0 ? (
              proposals.map((proposal) => (
                <ProposalItem key={proposal.uri} proposal={proposal} />
              ))
            ) : proposalsLoading ? (
              <li style={{ textAlign: 'center', padding: '20px', color: '#8A949E' }}>
                加载中...
              </li>
            ) : (
              <li style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                暂无提案
              </li>
            )}
          </ul>
          <div ref={loadMoreRef} style={{ height: 1 }} />
          {!proposalsLoading && hasMore && (
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <button className="view_treasury_button" onClick={() => loadMore()}>加载更多</button>
            </div>
          )}
        </section>
        <div className="my_info">
          {/* 我的治理部分 - 组件化并固定显示 */}
          <UserGovernance />

          {/* 金库概览部分 - 组件化并固定显示 */}
          <TreasuryOverview />
        </div>
        </div>
      </main>
      
    </div>
  );
}
