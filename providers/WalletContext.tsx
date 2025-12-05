"use client";

import { createContext, useContext } from "react";
import type { WalletClient, PublicClient } from "viem";
import type { providers } from "ethers";

export interface WalletContextType {
  eoaAddress: `0x${string}` | undefined;
  walletClient: WalletClient | null;
  publicClient: PublicClient | null;
  ethersSigner: providers.JsonRpcSigner | null;
  isReady: boolean;
}

export const WalletContext = createContext<WalletContextType>({
  eoaAddress: undefined,
  walletClient: null,
  publicClient: null,
  ethersSigner: null,
  isReady: false,
});

export function useWallet() {
  return useContext(WalletContext);
}
