declare module "react-notion-x/build/third-party/table-of-contents" {
  import * as React from "react";
  // 轻量声明，避免引入完整类型
  export interface TableOfContentsProps {
    recordMap: unknown;
    className?: string;
  }
  export const TableOfContents: React.ComponentType<TableOfContentsProps>;
}


