"use client";

import { useState, useEffect, ReactNode } from "react";
import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  type WalletClient,
} from "viem";
import { providers } from "ethers";
import { addRpcUrlOverrideToChain } from "@privy-io/chains";
import { PrivyProvider, useWallets } from "@privy-io/react-auth";
import { POLYGON_RPC_URL } from "@/constants/polymarket";
import { polygon } from "viem/chains";
import { WalletContext } from "@/providers/WalletContext";

const publicClient = createPublicClient({
  chain: polygon,
  transport: http(POLYGON_RPC_URL),
});

function WalletContextProvider({ children }: { children: ReactNode }) {
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [ethersSigner, setEthersSigner] =
    useState<providers.JsonRpcSigner | null>(null);
  const { wallets, ready } = useWallets();

  const wallet = wallets?.[0];
  const eoaAddress = (wallet?.address as `0x${string}`) ?? undefined;

  useEffect(() => {
    async function init() {
      if (!wallet || !ready) {
        setWalletClient(null);
        setEthersSigner(null);
        return;
      }

      try {
        const provider = await wallet.getEthereumProvider();

        const client = createWalletClient({
          account: eoaAddress!,
          chain: polygon,
          transport: custom(provider),
        });

        setWalletClient(client);

        const ethersProvider = new providers.Web3Provider(provider);
        setEthersSigner(ethersProvider.getSigner());
      } catch (err) {
        console.error("Failed to initialize wallet client:", err);
        setWalletClient(null);
        setEthersSigner(null);
      }
    }

    init();
  }, [wallet, ready, eoaAddress]);

  return (
    <WalletContext.Provider
      value={{
        eoaAddress,
        walletClient,
        publicClient,
        ethersSigner,
        isReady: ready && !!walletClient,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        defaultChain: polygon,
        supportedChains: [
          addRpcUrlOverrideToChain(polygon, POLYGON_RPC_URL as string),
        ],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <WalletContextProvider>{children}</WalletContextProvider>
    </PrivyProvider>
  );
}
