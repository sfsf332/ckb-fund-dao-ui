/**
 * 获取评论列表的自定义Hook
 */
import { useState, useEffect, useCallback } from 'react';
import { getCommentList, CommentItem } from '@/server/comment';
import useUserInfoStore from '@/store/userInfo';

interface UseCommentListResult {
  comments: CommentItem[];
  loading: boolean;
  error: string;
  hasMore: boolean;
  cursor: string | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
}

/**
 * 使用评论列表Hook
 * @param proposalUri 提案的 uri
 * @param limit 每页数量，默认20
 * @returns 评论列表、加载状态、错误信息、是否有更多数据、游标、重新获取函数和加载更多函数
 * 
 * @example
 * ```tsx
 * const { comments, loading, error, hasMore, loadMore, refetch } = useCommentList(proposalUri);
 * 
 * if (loading && comments.length === 0) return <div>加载中...</div>;
 * if (error) return <div>错误: {error}</div>;
 * 
 * return (
 *   <div>
 *     {comments.map(comment => <CommentItem key={comment.cid} comment={comment} />)}
 *     {hasMore && <button onClick={loadMore}>加载更多</button>}
 *   </div>
 * );
 * ```
 */
export function useCommentList(
  proposalUri: string | null,
  limit: number = 20
): UseCommentListResult {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  // 从 store 中获取用户的 did 作为 viewer
  const { userInfo } = useUserInfoStore();
  const viewer = userInfo?.did || null;

  // 获取评论列表
  const fetchComments = useCallback(async (reset: boolean = false) => {
    if (!proposalUri) {
      console.warn('提案URI为空，无法获取评论');
      setError('提案URI不能为空');
      return;
    }

    // 如果没有更多数据且不是重置操作，直接返回
    if (!hasMore && !reset) {
      console.log('没有更多评论数据');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const params = { 
        proposal: proposalUri,
        cursor: reset ? null : cursor,
        limit,
        viewer,
      };
      
      console.log('获取评论列表请求参数:', params);
      
      const data = await getCommentList(params);
      
      console.log('获取评论列表响应:', data);
      
      if (data) {
        const newComments = data.replies || [];
        
        
        // 如果是重置操作，直接设置新数据；否则追加数据
        setComments(prev => reset ? newComments : [...prev, ...newComments]);
        setCursor(data.cursor);
        setHasMore(!!data.cursor); // 如果有 cursor，说明还有更多数据
      } else {
        setError('获取评论列表失败');
      }
    } catch (err) {
      console.error('获取评论列表异常:', err);
      console.error('错误详情:', JSON.stringify(err, null, 2));
      
      const error = err as { response?: { status?: number; data?: unknown }; message?: string };
      
      // 打印更详细的错误信息
      if (error.response) {
        console.error('HTTP状态码:', error.response.status);
        console.error('响应数据:', error.response.data);
      }
      
      // 根据不同的错误类型设置错误信息
      if (error.response?.status === 404) {
        setError('评论不存在');
      } else if (error.response?.status === 401) {
        setError('需要登录才能查看评论');
      } else if (error.response?.status === 403) {
        setError('没有权限查看评论');
      } else {
        setError(error.message || '获取评论列表失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  }, [proposalUri, cursor, hasMore, limit, viewer]);

  // 重新获取（重置）
  const refetch = useCallback(async () => {
    setCursor(null);
    setHasMore(true);
    await fetchComments(true);
  }, [fetchComments]);

  // 加载更多
  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchComments(false);
    }
  }, [loading, hasMore, fetchComments]);

  // 初始加载
  useEffect(() => {
    if (proposalUri) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalUri, viewer]); // 当 proposalUri 或 viewer 变化时重新获取

  return {
    comments,
    loading,
    error,
    hasMore,
    cursor,
    refetch,
    loadMore,
  };
}

