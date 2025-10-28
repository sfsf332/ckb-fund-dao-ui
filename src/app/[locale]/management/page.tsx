"use client";

import Image from "next/image";
import "react-tooltip/dist/react-tooltip.css";
import Link from "next/link";
import { getAvatarByDid } from "@/utils/avatarUtils";

export default function Management() {

  return (
    <div className="container">
      <main>
        <div className="block_container">
          <h3>物业团队公示</h3>
          <p>
            第一届 CKB Community Fund DAO Web5 Track 物业团队，由 CKB Eco Fund
            负责组建，任期一年。
          </p>
          <p>
            DAO
            物业团队运行一年后，将开启完全社区化的选举，每届物业团队任期为半年。
          </p>
          <div className="team_list">
            <div className="team_item">
              <Image src={getAvatarByDid("did:ckb:ckt1qvqr...7q2h")} alt="avatar" width={40} height={40} />
              <div className="name">
                <h3>John</h3>
                <h4>DAO 物业经理</h4>
                <p>did:ckb:ckt1qvqr...7q2h</p>
                <p>
                  Twitter:
                  <Link href="https://twitter.com/john">
                    https://twitter.com/john
                  </Link>
                </p>
              </div>
            </div>
            <div className="team_item">
              <Image src={getAvatarByDid("did:ckb:ckt1qvqr...7q2h")} alt="avatar" width={40} height={40} />
              <div className="name">
                <h3>John</h3>
                <h4>DAO 物业经理</h4>
                <p>did:ckb:ckt1qvqr...7q2h</p>
                <p>
                  Twitter:
                  <Link href="https://twitter.com/john">
                    https://twitter.com/john
                  </Link>
                </p>
              </div>
            </div>
            <div className="team_item">
              <Image src={getAvatarByDid("did:ckb:ckt1qvqr...7q2h")} alt="avatar" width={40} height={40} />
              <div className="name">
                <h3>John</h3>
                <h4>DAO 物业经理</h4>
                <p>did:ckb:ckt1qvqr...7q2h</p>
                <p>
                  Twitter:
                  <Link href="https://twitter.com/john">
                    https://twitter.com/john
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="block_container">
          <h3>定位与使命</h3>
          <p>
            DAO 物业是一个由社区信任、受 DAO
            资助、并向全体投票人负责的程序型服务与促进团队。作为中立的服务提供者和流程促进者，为社区治理提供高质量的运营、监督和技术支持。
          </p>
          <div className="dash_line"></div>
          <h3>核心职责</h3>
          <p>按照 DAO 物业的定位与使命，其核心职责围绕其程序性权力展开。</p>
          <dl>
            <dt>提案生命周期管理:</dt>
            <dd>
              <ul>
                <li>
                  提案辅导与标准化： 提供清晰的提案模板，协助申请人完善提案。
                </li>
                <li>
                  组织社区质询： 在提案进入投票前，负责组织社区 AMA 或公开辩论。
                </li>
              </ul>
            </dd>
            <dt>监督与报告:</dt>
            <dd>
              <ul>
                <li>
                  里程碑核查： 对已通过拨款的提案，负责核查其里程碑交付物。
                </li>
                <li>
                  发布核查报告： 在每个里程碑节点，向社区公开发布核查报告。
                </li>
              </ul>
            </dd>
            <dt>透明化与沟通:</dt>
            <dd>
              <ul>
                <li>
                  金库资产透明化： 负责运营和维护基于 UTXO Global
                  多签钱包的资产看板。
                </li>
                <li>信息触达： 确保所有重要的治理信息有效触达社区成员。</li>
              </ul>
            </dd>
          </dl>
          <div className="dash_line"></div>
          <h3>权力边界</h3>
          <p>
            DAO
            物业成员不拥有提案的审核通过权，也不拥有任何投票决策权。其所有行动目标，是保障治理过程的公平、透明和高效，并将最完整、最中立的信息呈现给社区决策者。
          </p>
          <ul>
            <li>
              <strong>无决策权：</strong> DAO
              物业团队不拥有提案的审核通过权，也不拥有任何投票决策权。他们是社区决策、治理的“服务员”，而非“审批官”。
            </li>
            <li>
              <strong>无释法权：</strong> DAO
              物业团队无权解释或仲裁规则争议，只能严格按照社区已通过的成文规则执行程序。
            </li>
            <li>
              <strong>资金权责：</strong>{" "}
              物业团队无自主财政权。其与资金相关的职责仅限于：
              <ul>
                <li>
                  在社区投票批准一个项目后，按流程通知主金库多签人，将项目总预算划拨至对应的项目执行钱包。
                </li>
                <li>
                  作为项目执行钱包的多签人，在每个里程碑经社区投票确认通过后，与其他多签人一起，履行签名支付的程序性义务。
                </li>
              </ul>
            </li>
            <li>
              <strong>投票权利：</strong>{" "}
              作为社区一员，物业成员保留依据其所持有的投票权重，对所有提案行使个人投票的权利。
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
