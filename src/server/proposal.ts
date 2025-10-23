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

// 提案列表查询参数类型（cursor/limit 模式）
export interface ProposalListParams {
  cursor?: string | null; // 分页游标
  limit?: number; // 返回数量，默认20
  q?: string | null; // 关键词搜索
  repo?: string | null; // 过滤作者DID（用户 DID）
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

// 提案列表响应类型（扁平结构）
export interface ProposalListResponse {
  proposals: ProposalListItem[];
  cursor: string | null;
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
      body: ["cursor", "limit", "q", "repo", "viewer"],
    },
  }
);

// 投票权重查询参数类型
export interface VoteWeightParams {
  ckb_addr: string; // 用户CKB地址
}

// 投票权重响应类型
export interface VoteWeightResponse {
  weight: number; // 投票权重
  ckb_addr: string; // 用户CKB地址
}

/**
 * 获取用户投票权重
 * GET /api/vote/weight
 */
export const getVoteWeight = defineAPI<
  VoteWeightParams,
  VoteWeightResponse
>(
  "/vote/weight",
  "GET",
  {
    divider: {
      query: ["ckb_addr"], // ckb_addr作为查询参数
    },
  }
);
