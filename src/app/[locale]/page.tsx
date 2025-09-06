'use client';

import Image from "next/image";
import { useTranslation } from "../../utils/i18n";
import 'react-tooltip/dist/react-tooltip.css'
import { IoMdInformationCircleOutline } from "react-icons/io";

export default function Treasury() {
  const { t } = useTranslation();

  return (
    <div className="container">
      <main>
        <ul className="dao_info">
          <li>
            <h3>申请中提案</h3>
            <p>4</p>
          </li>
          <li>
            <h3>总申请预算</h3>
            <p>8,000,000 CKB</p>
          </li>
          <li>
            <h3>待拨款提案</h3>
            <p>8,000,000 CKB</p>
          </li>
          <li>
            <h3>待拨款预算</h3>
            <p>8,000,000 CKB</p>
          </li>
        </ul>
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
            {/* 提案1: Web5 DID 身份协议栈开发 */}
            <li>
              <h4>Web5 DID 身份协议栈开发 <span className="status-tag milestone">里程碑交付中</span></h4>
              <div className="proposal_person">
                <Image src="/avatar.jpg" alt="avatar" width={40} height={40} />
                <div className="name">
                  <h3>John</h3>
                  <p>did:ckb:ckt1qvqr...7q2h</p>
                </div>
                <p>July 25, 2025</p>
              </div>
              <div className="proposal_detail">
                <p>申请预算</p>
                <p>2,000,000 CKB</p>
              </div>
              <div className="proposal_progress">
                <p>进度: 里程碑 2/4</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '50%'}}></div>
                </div>
              </div>
            </li>

            {/* 提案2: DAO 治理元规则修改提案 #5 */}
            <li>
              <h4>DAO 治理元规则修改提案 #5 <span className="status-tag review">社区审议中</span></h4>
              <div className="proposal_person">
                <Image src="/avatar.jpg" alt="avatar" width={40} height={40} />
                <div className="name">
                  <h3>Krrrrr</h3>
                  <p>did:ckb:ckt1qyqr...7q2h</p>
                </div>
                <p>July 25, 2025</p>
              </div>
              <div className="proposal_detail">
                <p>申请预算</p>
                <p>2,000,000 CKB</p>
              </div>
              <div className="proposal_progress">
                <p>进度: -</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '0%'}}></div>
                </div>
              </div>
            </li>

            {/* 提案3: CKB-UTXO 全链游戏引擎 */}
            <li>
              <h4>CKB-UTXO 全链游戏引擎 <span className="status-tag vote">投票中</span></h4>
              <div className="proposal_person">
                <Image src="/avatar.jpg" alt="avatar" width={40} height={40} />
                <div className="name">
                  <h3>ckbtc</h3>
                  <p>did:ckb:ckt1qyqr...7q2h</p>
                </div>
                <p>July 25, 2025</p>
              </div>
              <div className="proposal_detail">
                <p>申请预算</p>
                <p>2,000,000 CKB</p>
              </div>
              <div className="proposal_voting">
                <div className="vote-item approve">
                  <p>赞成</p>
                  <p>65%</p>
                </div>
                <div className="vote-item oppose">
                  <p>反对</p>
                  <p>35%</p>
                </div>
              </div>
              <div className="proposal_progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '65%'}}></div>
                </div>
              </div>
            </li>

            {/* 提案4: JoyID 生态集成激励计划 */}
            <li>
              <h4>JoyID 生态集成激励计划 <span className="status-tag ended">结束</span></h4>
              <div className="proposal_person">
                <Image src="/avatar.jpg" alt="avatar" width={40} height={40} />
                <div className="name">
                  <h3>moe</h3>
                  <p>did:ckb:ckt1qyqr...7q2h</p>
                </div>
                <p>July 25, 2025</p>
              </div>
              <div className="proposal_detail">
                <p>申请预算</p>
                <p>2,000,000 CKB</p>
              </div>
              <div className="proposal_progress">
                <p>进度: 里程碑 4/4</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '100%'}}></div>
                </div>
              </div>
            </li>
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
