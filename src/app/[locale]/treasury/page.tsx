"use client";

import { useTranslation } from "../../../utils/i18n";
import "react-tooltip/dist/react-tooltip.css";
import Link from "next/link";
import copy from "copy-to-clipboard";
import { FaCopy } from "react-icons/fa";
import { AiOutlineExport } from "react-icons/ai";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import { IoMdInformationCircleOutline } from "react-icons/io";
import ProjectWalletsTable from "@/components/ProjectWalletsTable";

export default function Treasury() {
  useTranslation();
  const address = "ckb1qyqwtz3x2z7g8g7q2hdasmm5m4enr0v40s8k0q8x2v";

  // 动态加载图表以避免 SSR 问题
  const TotalAssetsChart = dynamic(() => import("../../../components/TotalAssetsChart"), {
    ssr: false,
  });

  const handleCopy = (address: string) => {
    copy(address);
    toast.success("已复制到剪贴板");
  };

  return (
    <div className="container">
      <main>
        <div className="block_container">
          <h3>金库信息</h3>
          <div className="treasury_wallet">
            <div className="treasury_wallet_address">
            <label>主金库地址</label>
            <p>{address}</p>
            </div>
            
            <button className="button-copy" onClick={() => handleCopy(address)} aria-label="copy-treasury-address">
              <FaCopy />
            </button>
            <Link href="#" aria-label="export-treasury-address">
              <AiOutlineExport />
            </Link>
          </div>
          <div className="dash_line"></div>
          <h4>多签人</h4>
          <ol className="treasury_list">
            <li>
              <span className="treasury_list_did">did::ckb:Daniel.xyz</span>
              <span>ckb1qyqwtz3x2z7g8g7q2hdasmm5m4enr0v40s8k0q8x2v</span>
              <button onClick={() => handleCopy("ckb1qyqwtz3x2z7g8g7q2hdasmm5m4enr0v40s8k0q8x2v")} aria-label="copy-treasury-address">
                <FaCopy />
              </button>
              <Link href="#" aria-label="export-treasury-address">
                <AiOutlineExport />
              </Link>
            </li>
            <li>
              <span className="treasury_list_did">did::ckb:Daniel.xyz</span>
              <span>ckb1qyqwtz3x2z7g8g7q2hdasmm5m4enr0v40s8k0q8x2v</span>
              <button onClick={() => handleCopy("ckb1qyqwtz3x2z7g8g7q2hdasmm5m4enr0v40s8k0q8x2v")} aria-label="copy-treasury-address">
                <FaCopy />
              </button>
              <Link href="#" aria-label="export-treasury-address">
                <AiOutlineExport />
              </Link>
            </li>
            <li>
              <span className="treasury_list_did">did::ckb:Daniel.xyz</span>
              <span>ckb1qyqwtz3x2z7g8g7q2hdasmm5m4enr0v40s8k0q8x2v</span>
              <button onClick={() => handleCopy("ckb1qyqwtz3x2z7g8g7q2hdasmm5m4enr0v40s8k0q8x2v")} aria-label="copy-treasury-address">
                <FaCopy />
              </button>
              <Link href="#" aria-label="export-treasury-address">
                <AiOutlineExport />
              </Link>
            </li>
          </ol>
        </div>
        <div className="block_container">
          <h3>金库资产</h3>
          <div className="treasury_assets">
            <div className="small_block">
              <h4>总资产（CKB）</h4>
              <p>500,000,000</p>
            </div>
            <div className="small_block">
              <h4>已分配资金（CKB）</h4>
              <p>500,000,000</p>
            </div>
            <div className="small_block">
              <h4>可用资金（CKB）</h4>
              <p>500,000,000</p>
            </div>
          </div>
          <h4>总资产统计</h4>
          <TotalAssetsChart height={320} />
        </div>
        <div className="block_container">
          <ProjectWalletsTable />
        </div>
      </main>
 
    </div>
  );
}
