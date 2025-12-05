import { useState, useCallback } from "react";
import { useWallet } from "@/providers/WalletContext";
import { BuilderConfig } from "@polymarket/builder-signing-sdk";
import { RelayClient } from "@polymarket/builder-relayer-client";

import {
  RELAYER_URL,
  POLYGON_CHAIN_ID,
  REMOTE_SIGNING_URL,
} from "@/constants/polymarket";

// This hook is responsible for creating and managing the relay client instance
// The user's signer and builder config are used to initialize the relay client

export default function useRelayClient() {
  const [relayClient, setRelayClient] = useState<RelayClient | null>(null);
  const { eoaAddress, ethersSigner } = useWallet();

  // This function initializes the relay client with
  // the user's signer and builder config
  const initializeRelayClient = useCallback(async () => {
    if (!eoaAddress || !ethersSigner) {
      throw new Error("Wallet not connected");
    }

    // The Builder's credentials are obtained from 'polymarket.com/settings?tab=builder'
    // A remote signing server allows the builder credentials to be kept secure while signing requests

    const builderConfig = new BuilderConfig({
      remoteBuilderConfig: {
        url: REMOTE_SIGNING_URL(),
      },
    });

    // The relayClient instance is used for deploying the Safe,
    // setting token approvals, and executing CTF operations such
    // as splitting, merging, and redeeming positions.

    const client = new RelayClient(
      RELAYER_URL,
      POLYGON_CHAIN_ID,
      ethersSigner,
      builderConfig
    );

    setRelayClient(client);
    return client;
  }, [eoaAddress, ethersSigner]);

  // This function clears the relay client and resets the state
  const clearRelayClient = useCallback(() => {
    setRelayClient(null);
  }, []);

  return {
    relayClient,
    initializeRelayClient,
    clearRelayClient,
  };
}
