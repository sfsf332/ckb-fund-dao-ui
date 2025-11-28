/**
 * 获取提案详情的自定义Hook
 */
import { useState, useEffect, useRef } from 'react';
import { getProposalDetail, ProposalDetailResponse } from '@/server/proposal';
import { getPostUriHref } from "@/lib/postUriHref";
import useUserInfoStore from '@/store/userInfo';

interface UseProposalDetailResult {
  proposal: ProposalDetailResponse | null;
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
}

/**
 * 使用提案详情Hook
 * @param uri 提案的URI
 * @returns 提案详情、加载状态、错误信息和重新获取函数
 * 
 * @example
 * ```tsx
 * const { proposal, loading, error, refetch } = useProposalDetail(uri);
 * 
 * if (loading) return <div>加载中...</div>;
 * if (error) return <div>错误: {error}</div>;
 * if (!proposal) return <div>提案不存在</div>;
 * 
 * return <div>{proposal.title}</div>;
 * ```
 */
export function useProposalDetail(uri: string | null): UseProposalDetailResult {
  const [proposal, setProposal] = useState<ProposalDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // 从 store 中获取用户的 did 作为 viewer
  const { userInfo } = useUserInfoStore();
  const viewer = userInfo?.did || null;

  // 使用 ref 跟踪上一次的 uri 和 viewer，避免重复调用
  const lastUriRef = useRef<string | null>(null);
  const lastViewerRef = useRef<string | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const fetchProposal = async () => {
    if (!uri) {
      setError('提案URI不能为空');
      setLoading(false);
      return;
    }

    // 防止并发请求
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError('');
      
      const data = await getProposalDetail({ 
        uri: getPostUriHref(uri),
        viewer: viewer 
      });
      
      setProposal(data);
      // 更新 ref 值，标记已获取
      lastUriRef.current = uri;
      lastViewerRef.current = viewer;
    } catch (err) {
      console.error('获取提案详情失败:', err);
      
      const error = err as { response?: { status?: number }; message?: string };
      
      // 根据不同的错误类型设置错误信息
      if (error.response?.status === 404) {
        setError('提案不存在');
      } else if (error.response?.status === 401) {
        setError('需要登录才能查看');
      } else if (error.response?.status === 403) {
        setError('没有权限查看该提案');
      } else {
        setError(error.message || '获取提案详情失败，请稍后重试');
      }
      
      setProposal(null);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    // 只有当 uri 或 viewer 真正变化时才调用，避免重复调用
    if (uri !== lastUriRef.current || viewer !== lastViewerRef.current) {
      fetchProposal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri, viewer]); // 当 uri 或 viewer 变化时重新获取

  return {
    proposal,
    loading,
    error,
    refetch: fetchProposal,
  };
}

