"use client";

import { useState, useEffect, useRef } from "react";
import { ProposalTimeline, ProposalVoting, MilestoneTracking } from "@/components/proposal-phase";
import { TimelineEvent } from "@/types/timeline";
import { VotingInfo, VoteOption } from "@/types/voting";
import { Milestone } from "@/types/milestone";
import { ProposalDetailResponse, updateVoteTxHash, getVoteStatus, VoteStatusResponse, getVoteDetail, VoteDetailResponse } from "@/server/proposal";
import { generateTimelineEvents } from "@/utils/timelineUtils";
import { generateVotingInfo, handleVote, buildAndSendVoteTransaction } from "@/utils/votingUtils";
import { generateMilestones } from "@/utils/milestoneUtils";
import { Proposal, ProposalStatus } from "@/utils/proposalUtils";
import { useWallet } from "@/provider/WalletProvider";
import { useVoteWeight } from "@/hooks/useVoteWeight";
import useUserInfoStore from "@/store/userInfo";
import { getAvatarByDid } from "@/utils/avatarUtils";
import { SuccessModal, Modal } from "@/components/ui/modal";
import { MdErrorOutline } from "react-icons/md";
import { useI18n } from "@/contexts/I18nContext";
import * as cbor from '@ipld/dag-cbor';
import { uint8ArrayToHex } from "@/lib/dag-cbor";
import storage from "@/lib/storage";
import { Secp256k1Keypair } from "@atproto/crypto";

interface ProposalSidebarProps {
  proposal: ProposalDetailResponse | null;
}

// 适配器函数：将API返回的ProposalDetailResponse转换为工具函数期望的Proposal类型
const adaptProposalDetail = (detail: ProposalDetailResponse): Proposal => {
  const proposalData = detail.record.data;

  const milestonesInfo = proposalData.milestones && proposalData.milestones.length > 0 ? {
    current: 1,
    total: proposalData.milestones.length,
    progress: 0,
  } : undefined;
  
  return {
    id: detail.cid,
    title: proposalData.title,
    state: (detail.state ?? proposalData.state) as ProposalStatus,
    type: proposalData.proposalType as Proposal["type"],
    proposer: {
      name: detail.author.displayName,
      avatar: getAvatarByDid(detail.author.did),
      did: detail.author.did,
    },
    budget: parseFloat(proposalData.budget) || 0,
    createdAt: detail.record.created,
    description: proposalData.background || '',
    milestones: milestonesInfo,
    category: proposalData.proposalType,
    tags: [],
  };
};

export default function ProposalSidebar({ proposal }: ProposalSidebarProps) {
  const { messages } = useI18n();
  const { userInfo } = useUserInfoStore();
  const { signer, walletClient, openSigner, isConnected } = useWallet();
  const { voteWeight } = useVoteWeight();
  
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [votingInfo, setVotingInfo] = useState<VotingInfo | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  
  // 投票弹窗状态
  const [showVoteSuccessModal, setShowVoteSuccessModal] = useState(false);
  const [showVoteErrorModal, setShowVoteErrorModal] = useState(false);
  const [voteErrorMessage, setVoteErrorMessage] = useState<string>('');

  // 使用 useRef 来跟踪已经请求过的 voteMetaId 和正在进行的请求，避免重复请求
  const fetchedVoteMetaIds = useRef<Set<number>>(new Set());
  const fetchingVoteMetaIds = useRef<Set<number>>(new Set());
  const fetchedVoteStatuses = useRef<Set<string>>(new Set());
  const fetchingVoteStatuses = useRef<Set<string>>(new Set());
  const lastVoteMetaId = useRef<number | null>(null);
  const lastStatusKey = useRef<string | null>(null);
  const lastProposalCid = useRef<string | null>(null);

  // 当提案数据加载完成后，生成相关数据（不包含API请求）
  useEffect(() => {
    if (!proposal) return;
    
    const adaptedProposal = adaptProposalDetail(proposal);

    // 生成时间线事件
    const events = generateTimelineEvents(adaptedProposal);
    setTimelineEvents(events);
    
    // 如果是投票阶段，生成投票信息
    if (adaptedProposal.state === ProposalStatus.VOTE && proposal.vote_meta) {
      // voteWeight 是 CKB 单位，需要转换为 shannon（最小单位）传递给 generateVotingInfo
      // generateVotingInfo 期望的是 shannon 单位，显示时会除以 100000000
      const userVotingPower = voteWeight * 100000000;
      const voting = generateVotingInfo(adaptedProposal, proposal.vote_meta, userVotingPower);
      setVotingInfo(voting);
    }
    
    // 如果是执行阶段，生成里程碑信息
    if (adaptedProposal.state === ProposalStatus.MILESTONE || 
        adaptedProposal.state === ProposalStatus.APPROVED || 
        adaptedProposal.state === ProposalStatus.ENDED) {
      const milestoneData = generateMilestones(adaptedProposal);
      setMilestones(milestoneData);
    }
  }, [proposal, voteWeight]);

  // 单独处理投票详情API请求（仅在 voteMetaId 变化时请求）
  useEffect(() => {
    if (!proposal || !proposal.vote_meta?.id) return;
    
    const voteMetaId = Number(proposal.vote_meta.id);
    if (isNaN(voteMetaId)) return;
    
    // 如果 proposal 的 cid 变化了，重置所有跟踪记录
    if (lastProposalCid.current !== proposal.cid) {
      fetchedVoteMetaIds.current.clear();
      fetchingVoteMetaIds.current.clear();
      lastVoteMetaId.current = null;
      lastProposalCid.current = proposal.cid;
    }
    
    // 如果 voteMetaId 变化了，重置该 voteMetaId 的跟踪记录
    if (lastVoteMetaId.current !== voteMetaId) {
      fetchedVoteMetaIds.current.delete(voteMetaId);
      fetchingVoteMetaIds.current.delete(voteMetaId);
      lastVoteMetaId.current = voteMetaId;
    }
    
    // 检查是否已经请求过或正在请求中
    if (!fetchedVoteMetaIds.current.has(voteMetaId) && 
        !fetchingVoteMetaIds.current.has(voteMetaId)) {
      fetchingVoteMetaIds.current.add(voteMetaId);
      
      (getVoteDetail({
        id: voteMetaId,
      }) as unknown as Promise<VoteDetailResponse>)
      .then((voteDetail) => {
        let approveVotes = 0;
        let rejectVotes = 0;
        
        // candidate_votes 格式: [[票数, 权重], [票数, 权重], [票数, 权重]]
        // 使用权重（第二个元素）而不是票数（第一个元素）
        if (voteDetail.candidate_votes && Array.isArray(voteDetail.candidate_votes)) {
          if (voteDetail.candidate_votes[1] && Array.isArray(voteDetail.candidate_votes[1])) {
            approveVotes = voteDetail.candidate_votes[1][1] || 0; // 使用权重
          }
          if (voteDetail.candidate_votes[2] && Array.isArray(voteDetail.candidate_votes[2])) {
            rejectVotes = voteDetail.candidate_votes[2][1] || 0; // 使用权重
          }
        }
        
        // 使用权重总和而不是投票数总和
        const totalVotes = voteDetail.valid_weight_sum ?? voteDetail.weight_sum ?? 0;
        const approvalRate = totalVotes > 0 
          ? (approveVotes / totalVotes) * 100 
          : 0;
        
        setVotingInfo(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            totalVotes: totalVotes || prev.totalVotes,
            approveVotes: approveVotes || prev.approveVotes,
            rejectVotes: rejectVotes || prev.rejectVotes,
            conditions: {
              ...prev.conditions,
              currentTotalVotes: totalVotes || prev.conditions.currentTotalVotes,
              currentApprovalRate: approvalRate || prev.conditions.currentApprovalRate,
            },
          };
        });
        
        // 标记为已请求完成
        fetchedVoteMetaIds.current.add(voteMetaId);
        fetchingVoteMetaIds.current.delete(voteMetaId);
      })
      .catch((error: unknown) => {
        console.error("获取投票详情失败:", error);
        // 请求失败时，从正在请求的集合中移除，允许重试
        fetchingVoteMetaIds.current.delete(voteMetaId);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal?.cid, proposal?.vote_meta?.id]);

  // 单独处理投票状态API请求（仅在 did 或 voteMetaId 变化时请求）
  useEffect(() => {
    if (!proposal || !proposal.vote_meta?.id || !userInfo?.did) return;
    
    const voteMetaId = Number(proposal.vote_meta.id);
    if (isNaN(voteMetaId)) return;
    
    const statusKey = `${userInfo.did}-${voteMetaId}`;
    
    // 如果 proposal 的 cid 变化了，重置所有跟踪记录
    if (lastProposalCid.current !== proposal.cid) {
      fetchedVoteStatuses.current.clear();
      fetchingVoteStatuses.current.clear();
      lastStatusKey.current = null;
      lastProposalCid.current = proposal.cid;
    }
    
    // 如果 statusKey 变化了，重置该 statusKey 的跟踪记录
    if (lastStatusKey.current !== statusKey) {
      fetchedVoteStatuses.current.delete(statusKey);
      fetchingVoteStatuses.current.delete(statusKey);
      lastStatusKey.current = statusKey;
    }
    
    // 检查是否已经请求过或正在请求中
    if (!fetchedVoteStatuses.current.has(statusKey) && 
        !fetchingVoteStatuses.current.has(statusKey)) {
      fetchingVoteStatuses.current.add(statusKey);
      
      (getVoteStatus({
        did: userInfo.did,
        vote_meta_id: voteMetaId,
      }) as unknown as Promise<VoteStatusResponse>)
      .then((voteStatus) => {
        let userVote: VoteOption | undefined;
        if (voteStatus.candidates_index === 1) {
          userVote = VoteOption.APPROVE;
        } else if (voteStatus.candidates_index === 2) {
          userVote = VoteOption.REJECT;
        }
        
        // 注意：voteStatus 中的 total_votes、approve_votes、reject_votes 代表的是投票权重，不是投票人数
        setVotingInfo(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            totalVotes: voteStatus.total_votes ?? prev.totalVotes,
            approveVotes: voteStatus.approve_votes ?? prev.approveVotes,
            rejectVotes: voteStatus.reject_votes ?? prev.rejectVotes,
            userVote: userVote ?? prev.userVote,
            userVoteIndex: voteStatus.candidates_index ?? prev.userVoteIndex,
            voteState: voteStatus.state ?? prev.voteState,
            conditions: {
              ...prev.conditions,
              currentTotalVotes: voteStatus.total_votes ?? prev.conditions.currentTotalVotes,
              currentApprovalRate: voteStatus.approval_rate ?? prev.conditions.currentApprovalRate,
            },
          };
        });
        
        // 标记为已请求完成
        fetchedVoteStatuses.current.add(statusKey);
        fetchingVoteStatuses.current.delete(statusKey);
      })
      .catch((error: unknown) => {
        console.error("获取投票状态失败:", error);
        // 请求失败时，从正在请求的集合中移除，允许重试
        fetchingVoteStatuses.current.delete(statusKey);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal?.cid, proposal?.vote_meta?.id, userInfo?.did]);

  // 处理投票
  const handleVoteSubmit = async (option: VoteOption) => {
    if (!votingInfo || !userInfo?.did) {
      const errorMsg = messages.modal.voteModal.missingInfo || '缺少投票信息或用户未登录';
      setVoteErrorMessage(errorMsg);
      setShowVoteErrorModal(true);
      return;
    }
    
    if (!isConnected || !signer || !walletClient) {
      openSigner();
      return;
    }
    
    try {
      const voteMetaId = proposal?.vote_meta?.id || 2;
      
      const result = await handleVote(userInfo.did, voteMetaId, option);
      if (!result.success || !result.data) {
        const errorMsg = result.error || messages.modal.voteModal.voteFailedMessage;
        setVoteErrorMessage(errorMsg);
        setShowVoteErrorModal(true);
        return;
      }
      
      const txResult = await buildAndSendVoteTransaction(
        result.data,
        option,
        signer,
        walletClient
      );
      
      if (txResult.success && txResult.txHash) {
        try {
          const candidates = result.data.vote_meta.candidates || ["Abstain", "Agree", "Against"];
          let candidatesIndex: number = 0;
          if (option === VoteOption.APPROVE) {
            candidatesIndex = candidates.indexOf("Agree");
            if (candidatesIndex === -1) candidatesIndex = 1;
          } else if (option === VoteOption.REJECT) {
            candidatesIndex = candidates.indexOf("Against");
            if (candidatesIndex === -1) candidatesIndex = 2;
          }
          
          const updateParams = {
            id: voteMetaId,
            tx_hash: txResult.txHash,
            candidates_index: candidatesIndex,
          };
          
          const unsignedCommit = cbor.encode(updateParams);
          const storageInfo = storage.getToken();
          if (storageInfo?.signKey) {
            const keyPair = await Secp256k1Keypair.import(storageInfo.signKey.slice(2));
            const signature = await keyPair.sign(unsignedCommit);
            const signedBytes = uint8ArrayToHex(signature);
            const signingKeyDid = keyPair.did();
            
            await updateVoteTxHash({
              did: userInfo.did,
              params: updateParams,
              signed_bytes: signedBytes,
              signing_key_did: signingKeyDid,
            });
            
            try {
              const voteStatus = await getVoteStatus({
                did: userInfo.did,
                vote_meta_id: voteMetaId,
              });
              
              let userVoteFromStatus: VoteOption | undefined;
              if (voteStatus.candidates_index === 1) {
                userVoteFromStatus = VoteOption.APPROVE;
              } else if (voteStatus.candidates_index === 2) {
                userVoteFromStatus = VoteOption.REJECT;
              }
              
              setVotingInfo(prev => {
                if (!prev) return prev;
                
                return {
                  ...prev,
                  userVote: userVoteFromStatus ?? prev.userVote,
                  userVoteIndex: voteStatus.candidates_index ?? prev.userVoteIndex,
                  voteState: voteStatus.state ?? prev.voteState,
                  totalVotes: voteStatus.total_votes ?? prev.totalVotes,
                  approveVotes: voteStatus.approve_votes ?? prev.approveVotes,
                  rejectVotes: voteStatus.reject_votes ?? prev.rejectVotes,
                  conditions: {
                    ...prev.conditions,
                    currentTotalVotes: voteStatus.total_votes ?? prev.conditions.currentTotalVotes,
                    currentApprovalRate: voteStatus.approval_rate ?? prev.conditions.currentApprovalRate,
                  },
                };
              });
            } catch (statusError) {
              console.error("查询投票状态失败:", statusError);
            }
          }
        } catch (updateError) {
          console.error("更新投票交易哈希失败:", updateError);
        }
        
        const candidatesIndex = option === VoteOption.APPROVE ? 1 : 2;
        
        setVotingInfo(prev => prev ? {
          ...prev,
          userVote: option,
          userVoteIndex: candidatesIndex,
          voteState: 0,
          totalVotes: prev.totalVotes + prev.userVotingPower,
          approveVotes: option === VoteOption.APPROVE 
            ? prev.approveVotes + prev.userVotingPower 
            : prev.approveVotes,
          rejectVotes: option === VoteOption.REJECT 
            ? prev.rejectVotes + prev.userVotingPower 
            : prev.rejectVotes,
          conditions: {
            ...prev.conditions,
            currentTotalVotes: prev.totalVotes + prev.userVotingPower,
            currentApprovalRate: option === VoteOption.APPROVE 
              ? ((prev.approveVotes + prev.userVotingPower) / (prev.totalVotes + prev.userVotingPower)) * 100
              : (prev.approveVotes / (prev.totalVotes + prev.userVotingPower)) * 100
          }
        } : null);
        
        setShowVoteSuccessModal(true);
      } else {
        const errorMsg = txResult.error || messages.modal.voteModal.voteFailedMessage;
        setVoteErrorMessage(errorMsg);
        setShowVoteErrorModal(true);
      }
    } catch (error) {
      console.error('投票失败:', error);
      let errorMsg = messages.modal.voteModal.voteFailedMessage;
      if (error instanceof Error) {
        errorMsg = error.message || errorMsg;
      } else if (typeof error === 'string') {
        errorMsg = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMsg = String(error.message);
      }
      setVoteErrorMessage(errorMsg);
      setShowVoteErrorModal(true);
    }
  };

  if (!proposal) {
    return null;
  }

  return (
    <>
      <div className="proposal-sidebar">
        {/* 投票组件 - 仅在投票阶段显示 */}
        {votingInfo && (
          <ProposalVoting 
            votingInfo={votingInfo}
            onVote={handleVoteSubmit}
          />
        )}
        
        {/* 里程碑追踪组件 - 仅在执行阶段显示 */}
        {milestones.length > 0 && (
          <MilestoneTracking 
            milestones={milestones}
            currentMilestone={proposal.state - 1000 || 1}
            totalMilestones={proposal.record.data.milestones?.length || 3}
          />
        )}
        
        <ProposalTimeline 
          events={timelineEvents} 
        />
      </div>
      
      {/* 投票成功弹窗 */}
      <SuccessModal
        isOpen={showVoteSuccessModal}
        onClose={() => setShowVoteSuccessModal(false)}
        message={messages.modal.voteModal.voteSuccess}
      />
      
      {/* 投票失败弹窗 */}
      <Modal
        isOpen={showVoteErrorModal}
        onClose={() => {
          setShowVoteErrorModal(false);
          setVoteErrorMessage('');
        }}
        title={messages.modal.voteModal.voteFailed}
        size="small"
        showCloseButton={false}
        buttons={[
          {
            text: messages.modal.voteModal.close,
            onClick: () => {
              setShowVoteErrorModal(false);
              setVoteErrorMessage('');
            },
            variant: 'secondary'
          }
        ]}
      >
        <div className="error-content" style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '48px', color: '#ff4d6d', marginBottom: '16px' }}>
            <MdErrorOutline />
          </div>
          <p style={{ color: '#FFFFFF', margin: 0, wordBreak: 'break-word' }}>
            {voteErrorMessage || messages.modal.voteModal.voteFailedMessage}
          </p>
        </div>
      </Modal>
    </>
  );
}
