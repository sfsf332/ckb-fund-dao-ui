"use client";

import { ccc } from "@ckb-ccc/connector-react";
import { CSSProperties } from "react";
import React, { useEffect } from "react";
import { WalletProvider } from "@/provider/WalletProvider";
import useUserInfoStore from "@/store/userInfo";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { initialize, initialized } = useUserInfoStore();
  
  const defaultClient = React.useMemo(() => {
    const isMainnet = process.env.NEXT_PUBLIC_IS_MAINNET === "true";

    return isMainnet
      ? new ccc.ClientPublicMainnet()
      : new ccc.ClientPublicTestnet();
  }, []);

  // 初始化用户信息store
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  return (
    <ccc.Provider
      connectorProps={{
        style: {
          //   "--background": "#00CC9B",
          //   "--divider": "rgba(255, 255, 255, 0.1)",
          //   "--btn-primary": "#2D2F2F",
          //   "--btn-primary-hover": "#515151",
          //   "--btn-secondary": "#2D2F2F",
          //   "--btn-secondary-hover": "#515151",
          //   "--icon-primary": "#000000",
          //   "--icon-secondary": "rgba(255, 255, 255, 0.6)",
          //   color: "#000000",
          //   "--tip-color": "#666",
        } as CSSProperties,
      }}
      defaultClient={defaultClient}
      clientOptions={[
        {
          name: "CKB Testnet",
          client: new ccc.ClientPublicTestnet(),
        },
        {
          name: "CKB Mainnet",
          client: new ccc.ClientPublicMainnet(),
        },
      ]}
    >
      <WalletProvider>
        {children}
      </WalletProvider>
    </ccc.Provider>
  );
}
