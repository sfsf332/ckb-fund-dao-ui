'use client';

import Image from "next/image";
import 'react-tooltip/dist/react-tooltip.css'
import { IoMdInformationCircleOutline } from "react-icons/io";
import ProposalItem from "../../components/ProposalItem";
import { useProposalList } from "../../hooks/useProposalList";
import useUserInfoStore from "@/store/userInfo";

export default function Treasury() {
  const { userInfo } = useUserInfoStore();
  // 使用hooks获取提案列表
  const { proposals, loading: proposalsLoading, error: proposalsError } = useProposalList({
    page: 1,
    pageSize: 1,
    viewer: userInfo?.did, // 获取所有提案
  });

  // 显示加载状态
  if (proposalsLoading) {
    return (
      <div className="container">
        <main>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>加载中...</p>
          </div>
        </main>
      </div>
    );
  }

  // 显示错误状态
  if (proposalsError) {
    return (
      <div className="container">
        <main>
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            <p>加载失败: {proposalsError}</p>
          </div>
        </main>
      </div>
    );
  }

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
            {/* <div className="nav-controls">
              <input type="search" placeholder="搜索提案" />
              <select name="" id="" defaultValue={'筛选状态'}>
                <option value="">全部</option>
                <option value="">提案中</option>
                <option value="">提案通过</option>
                <option value="">提案拒绝</option>
              </select>
            </div> */}
          </nav>
          
          <ul className="proposal_list_content">
            {proposals.length > 0 ? (
              proposals.map((proposal) => (
                <ProposalItem key={proposal.uri} proposal={proposal} />
              ))
            ) : (
              <li style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                暂无提案
              </li>
            )}
          </ul>
        </section>
        <div className="my_info">
          {/* 我的治理部分 */}
          <section className="my_governance">
            <h3>我的治理</h3>
            <div className="wallet_info">
              <h4>钱包地址/DID</h4>
              <p className="did_address">did:ckb:ckt1q9gry5zgxmpjnm26ztnq3w0y3j9f6j28q5y7q2</p>
            </div>
            <div className="voting_rights">
              <h4>
                我的投票权 <IoMdInformationCircleOutline data-tooltip-id="my-tooltip" data-tooltip-content="投票权的解释" />
              </h4>
              <h5 className="rights_amount">2,000,000 CKB</h5>
            </div>
            <button className="stake_button">
              <Image src="/nervos-logo-s.svg" alt="nervos" width={14} height={14} />
               质押CKB
            </button>
            <div className="pending_section">
              <h4>待处理</h4>
              <div className="pending_item">
                <p className="pending_title">CKB-UTXO 全链游戏引擎</p>
                <span className="status-tag vote">投票中</span>
              </div>
            </div>
          </section>

          {/* 金库概览部分 */}
          <section className="treasury_overview">
            <h3>金库概览</h3>
            <div className="treasury_balance">
              <label>主金库余额</label>
              <p className="balance_amount">500,000,000 CKB</p>
            </div>
            <button className="view_treasury_button">
              查看金库详细
            </button>
          </section>
        </div>
        </div>
      </main>
      
    </div>
  );
}
