// 评论数据结构定义

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    did?: string;
  };
  createdAt: string;
  updatedAt?: string;
  likes: number;
  replies: Comment[];
  parentId?: string; // 用于回复功能
  isLiked?: boolean; // 当前用户是否点赞
  isAuthor?: boolean; // 是否为当前用户发布
}

export interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
  onReplyComment: (commentId: string, content: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  loading?: boolean;
  error?: string;
  quotedText?: string;
}

export interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  level?: number; // 嵌套层级，用于回复显示
}

export interface CommentReplyProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
}

export interface CommentQuoteProps {
  onSubmit: (content: string, parentId?: string) => void;
  placeholder?: string;
  parentId?: string;
  isReply?: boolean;
  quotedText?: string;
}
