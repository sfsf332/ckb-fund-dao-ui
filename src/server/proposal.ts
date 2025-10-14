/**
 * 提案相关API接口定义
 */
import { ProposalStatus } from "@/utils/proposalUtils";
import defineAPI from "./defineAPI";

// 提案详情接口的参数类型
export interface ProposalDetailParams {
  uri: string; // 提案的URI
  viewer:string | null; // 查看者的did
}

// 提案里程碑类型
export interface ProposalMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  index:number
}

// 提案详情接口的响应类型
export interface ProposalDetailResponse {
  state:number;
  author: {
    $type: string;
    created: string;
    did: string;
    displayName: string;
    handle: string;
  };

  cid: string;
  like_count: string;
  liked: boolean;
  record: {
    $type: string;
    created: string;
    data: {
      state: ProposalStatus;
      background: string;
      budget: string;
      goals: string;
      milestones: ProposalMilestone[];
      proposalType: string;
      releaseDate: string;
      team: string;
      title: string;
    };
  };
  updated: string;
  uri: string;
}

/**
 * 获取提案详情
 * GET /api/proposal/detail
 */
export const getProposalDetail = defineAPI<
  ProposalDetailParams,
  ProposalDetailResponse
>(
  "/proposal/detail",
  "GET",
  {
    divider: {
      query: ["uri","viewer"], // uri作为查询参数
    },
  }
);

// 提案列表查询参数类型
export interface ProposalListParams {
  page?: number; // 页码，默认1
  pageSize?: number; // 每页数量，默认10
  status?: string; // 提案状态筛选
  type?: string; // 提案类型筛选
  keyword?: string; // 关键词搜索
  sortBy?: string; // 排序字段
  sortOrder?: "asc" | "desc"; // 排序方向
  viewer?: string | null; // 查看者的did
}

// 提案列表项类型 - 与提案详情结构相同
export interface ProposalListItem {
  state: number; // 提案状态
  author: {
    $type: string;
    created: string;
    did: string;
    displayName: string;
    handle: string;
  };
  cid: string;
  like_count: string;
  liked: boolean;
  record: {
    $type: string;
    created: string;
    data: {
      background: string;
      budget: string;
      goals: string;
      milestones: ProposalMilestone[];
      proposalType: string;
      releaseDate: string;
      team: string;
      title: string;
    };
  };
  updated: string;
  uri: string;
}

// 提案列表响应类型
export interface ProposalListResponse {
  proposals: ProposalListResponse;
  cursor: string;
  code: number;
  data: {
    cursor: string;
    proposals: ProposalListItem[];
  };
  message: string;
}

/**
 * 获取提案列表
 * POST /api/proposal/list
 */
export const getProposalList = defineAPI<
  ProposalListParams,
  ProposalListResponse
>(
  "/proposal/list",
  "POST",
  {
    divider: {
      body: ["page", "pageSize", "status", "type", "keyword", "sortBy", "sortOrder", "viewer"],
    },
  }
);
