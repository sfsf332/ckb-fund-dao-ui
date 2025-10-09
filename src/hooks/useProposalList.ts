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
  refetch: (params?: ProposalListParams) => Promise<void>;
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
 *   pageSize: 10 
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
  initialParams: ProposalListParams = { page: 1, pageSize: 10 }
): UseProposalListResult {
  const [proposals, setProposals] = useState<ProposalListItem[]>([]);
  const [cursor, setCursor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [params, setParams] = useState<ProposalListParams>(initialParams);

  const fetchProposals = useCallback(async (queryParams?: ProposalListParams) => {
    try {
      setLoading(true);
      setError('');

      const finalParams = queryParams || params;
      
      const response = await getProposalList(finalParams);
      debugger
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
      } else {
        setProposals([]);
        setCursor('');
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
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProposals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return {
    proposals,
    cursor,
    loading,
    error,
    refetch: fetchProposals,
  };
}

