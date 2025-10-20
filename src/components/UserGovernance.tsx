import Image from "next/image";
import { IoMdInformationCircleOutline } from "react-icons/io";
import useUserInfoStore from "@/store/userInfo";
import Tag from "@/components/ui/tag/Tag";

export default function UserGovernance() {
  const { userInfo } = useUserInfoStore();
  const did = userInfo?.did || '未登录';
  return (
    <section className="my_governance">
      <h3>我的治理</h3>
      <div className="wallet_info">
        <h4>钱包地址/DID</h4>
        <p className="did_address">{did}</p>
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
          <Tag type="status" size="sm" className="tag-status--vote">投票中</Tag>
        </div>
      </div>
    </section>
  );
}


