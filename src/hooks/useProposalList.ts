/**
 * 获取提案列表的自定义Hook
 */
import { useState, useEffect, useCallback } from 'react';
import {
  getProposalList,
  ProposalListParams,
  ProposalListItem,
} from '@/server/proposal';
// import { ProposalMilestone } from '@/types/milestone'; // 已移除无效导入
interface UseProposalListResult {
  proposals: ProposalListItem[];
  cursor: string;
  loading: boolean;
  error: string;
  hasMore: boolean;
  refetch: (params?: ProposalListParams) => Promise<void>;
  loadMore: () => Promise<void>;
}

/**
 * 使用提案列表Hook
 * @param initialParams 初始查询参数
 * @returns 提案列表、分页信息、加载状态、错误信息和重新获取函数
 * 
 * @example
 * ```tsx
 * const { proposals, loading, error, page, totalPages, refetch } = useProposalList({ 
 *   page: 1, 
 *   pageSize: 10,
 *   viewer: 'did:plc:xxx'
 * });
 * 
 * if (loading) return <div>加载中...</div>;
 * if (error) return <div>错误: {error}</div>;
 * 
 * return (
 *   <div>
 *     {proposals.map(p => <ProposalItem key={p.id} proposal={p} />)}
 *   </div>
 * );
 * ```
 */
export function useProposalList(
  initialParams: ProposalListParams = { limit: 20, viewer: null, cursor: null }
): UseProposalListResult {
  const [proposals, setProposals] = useState<ProposalListItem[]>([]);
  const [cursor, setCursor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [params, setParams] = useState<ProposalListParams>(initialParams);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchProposals = useCallback(async (queryParams?: ProposalListParams) => {
    try {
      setLoading(true);
      setError('');

      const finalParams = queryParams || params;
      
      const response = await getProposalList(finalParams);
      
      // 处理新的返回数据结构
      if (response && Array.isArray(response.proposals)) {
        // 为milestones添加index字段
        const proposalsWithIndex = response.proposals.map((proposal: ProposalListItem) => ({
          ...proposal,
          record: {
            ...proposal.record,
            data: {
              ...proposal.record.data,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              milestones: proposal.record.data.milestones?.map((milestone: any, index: number) => ({
                ...milestone,
                index,
              })) || [],
            },
          },
        }));
        
        setProposals(proposalsWithIndex);
        setCursor(response.cursor || '');
        // 有 cursor 表示还有下一页；否则依据返回数量与 limit 判断
        setHasMore(!!response.cursor || proposalsWithIndex.length >= (finalParams.limit || 20));
      } else {
        setProposals([]);
        setCursor('');
        setHasMore(false);
      }
      
      if (queryParams) {
        setParams(finalParams);
      }
    } catch (err) {
      console.error('获取提案列表失败:', err);
      const error = err as { response?: { status?: number }; message?: string };
      
      // 根据不同的错误类型设置错误信息
      if (error.response?.status === 401) {
        setError('需要登录才能查看提案列表');
      } else if (error.response?.status === 403) {
        setError('没有权限查看提案列表');
      } else if (error.response?.status === 500) {
        setError('服务器错误，请稍后重试');
      } else {
        setError(error.message || '获取提案列表失败，请稍后重试');
      }
      
      setProposals([]);
      setCursor('');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProposals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const nextParams: ProposalListParams = {
        ...params,
        cursor: cursor || null,
      };
      const response = await getProposalList(nextParams);
      if (response && Array.isArray(response.proposals)) {
        const proposalsWithIndex = response.proposals.map((proposal: ProposalListItem) => ({
          ...proposal,
          record: {
            ...proposal.record,
            data: {
              ...proposal.record.data,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              milestones: proposal.record.data.milestones?.map((milestone: any, index: number) => ({
                ...milestone,
                index,
              })) || [],
            },
          },
        }));
        setProposals(prev => [...prev, ...proposalsWithIndex]);
        setCursor(response.cursor || '');
        setParams({ ...params });
        setHasMore(!!response.cursor || proposalsWithIndex.length >= (nextParams.limit || 20));
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('加载更多提案失败:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [params, loading, hasMore, cursor]);
  
  return {
    proposals,
    cursor,
    loading,
    error,
    hasMore,
    refetch: fetchProposals,
    loadMore,
  };
}

