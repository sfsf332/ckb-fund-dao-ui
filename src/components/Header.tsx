"use client";

import React from "react";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";
import { ccc } from "@ckb-ccc/connector-react";

export default function Header() {
    const { open } = ccc.useCcc();

  return (
    <div className="flex items-center justify-between p-4 header-container">
      <div className="flex items-center gap-2 logo">
        <Image src="/nervos-logo.svg" alt="logo" width={36} height={36} priority />
        <span>CKB Community Fund DAO</span>
        <span className="version">V1.1</span>
      </div>
      <ul className="navs flex items-center flex-start gap-2">
        <li>
          <Link href="/" className="active">治理主页</Link>
        </li>
        <li>
          <Link href="/">金库</Link>
        </li>
        <li>
          <Link href="/">物业信息</Link>
        </li>
        <li>
          <Link href="/">治理规则</Link>
        </li>
      </ul>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <button className="button-secondary">
          <CiCirclePlus /> 发起提案
        </button>
        <button
          onClick={open}
          className="button-normal"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
