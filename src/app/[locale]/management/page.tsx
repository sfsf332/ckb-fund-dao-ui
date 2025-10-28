"use client";

import Image from "next/image";
import "react-tooltip/dist/react-tooltip.css";
import Link from "next/link";
import { getAvatarByDid } from "@/utils/avatarUtils";
import { useTranslation } from "@/utils/i18n";

export default function Management() {
  const { t } = useTranslation();

  return (
    <div className="container">
      <main>
        <div className="block_container">
          <h3>{t("managementPage.title")}</h3>
          <p>
            {t("managementPage.description")}
          </p>
          <p>
            {t("managementPage.futureDescription")}
          </p>
          <div className="team_list">
            <div className="team_item">
              <Image src={getAvatarByDid("did:ckb:ckt1qvqr...7q2h")} alt="avatar" width={40} height={40} />
              <div className="name">
                <h3>John</h3>
                <h4>{t("managementPage.daoManager")}</h4>
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
                <h4>{t("managementPage.daoManager")}</h4>
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
                <h4>{t("managementPage.daoManager")}</h4>
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
          <h3>{t("managementPage.positionMission")}</h3>
          <p>
            {t("managementPage.positionMissionDesc")}
          </p>
          <div className="dash_line"></div>
          <h3>{t("managementPage.coreResponsibilities")}</h3>
          <p>{t("managementPage.coreResponsibilitiesDesc")}</p>
          <dl>
            <dt>{t("managementPage.proposalLifecycle")}</dt>
            <dd>
              <ul>
                <li>
                  {t("managementPage.proposalGuidance")}
                </li>
                <li>
                  {t("managementPage.communityInquiry")}
                </li>
              </ul>
            </dd>
            <dt>{t("managementPage.supervisionReporting")}</dt>
            <dd>
              <ul>
                <li>
                  {t("managementPage.milestoneVerification")}
                </li>
                <li>
                  {t("managementPage.verificationReport")}
                </li>
              </ul>
            </dd>
            <dt>{t("managementPage.transparencyCommunication")}</dt>
            <dd>
              <ul>
                <li>
                  {t("managementPage.treasuryTransparency")}
                </li>
                <li>{t("managementPage.informationReach")}</li>
              </ul>
            </dd>
          </dl>
          <div className="dash_line"></div>
          <h3>{t("managementPage.powerBoundaries")}</h3>
          <p>
            {t("managementPage.powerBoundariesDesc")}
          </p>
          <ul>
            <li>
              <strong>{t("managementPage.noDecisionRights")}</strong>
            </li>
            <li>
              <strong>{t("managementPage.noInterpretationRights")}</strong>
            </li>
            <li>
              <strong>{t("managementPage.fundResponsibilities")}</strong>
              <ul>
                <li>
                  {t("managementPage.budgetAllocation")}
                </li>
                <li>
                  {t("managementPage.milestonePayment")}
                </li>
              </ul>
            </li>
            <li>
              <strong>{t("managementPage.votingRights")}</strong>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
