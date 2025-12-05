"use client";

import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import WalletProvider from "./WalletProvider";
import TradingProvider from "./TradingProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <QueryProvider>
        <TradingProvider>{children}</TradingProvider>
      </QueryProvider>
    </WalletProvider>
  );
}
