import { useMemo } from "react";
import { ClobClient } from "@polymarket/clob-client";
import { useWallet } from "@/providers/WalletContext";
import useSafeDeployment from "@/hooks/useSafeDeployment";
import { BuilderConfig } from "@polymarket/builder-signing-sdk";

import { TradingSession } from "@/utils/session";
import {
  CLOB_API_URL,
  POLYGON_CHAIN_ID,
  REMOTE_SIGNING_URL,
} from "@/constants/polymarket";

// This hook creates the authenticated clobClient with the User API Credentials
// and the builder config credentials, but only after a trading session is initialized

export default function useClobClient(
  tradingSession: TradingSession | null,
  isTradingSessionComplete: boolean | undefined
) {
  const { eoaAddress, ethersSigner } = useWallet();
  const { derivedSafeAddressFromEoa } = useSafeDeployment(eoaAddress);

  const clobClient = useMemo(() => {
    if (
      !ethersSigner ||
      !eoaAddress ||
      !derivedSafeAddressFromEoa ||
      !isTradingSessionComplete ||
      !tradingSession?.apiCredentials
    ) {
      return null;
    }

    // Builder config with remote server signing for order attribution
    const builderConfig = new BuilderConfig({
      remoteBuilderConfig: {
        url: REMOTE_SIGNING_URL(),
      },
    });

    // This is the persisted clobClient instance for creating and posting
    // orders for the user, with proper builder order attribution
    return new ClobClient(
      CLOB_API_URL,
      POLYGON_CHAIN_ID,
      ethersSigner,
      tradingSession.apiCredentials,
      2, // signatureType = 2 for embedded wallet EOA to sign for Safe proxy wallet
      derivedSafeAddressFromEoa,
      undefined, // mandatory placeholder
      false,
      builderConfig // Builder order attribution
    );
  }, [
    eoaAddress,
    ethersSigner,
    derivedSafeAddressFromEoa,
    isTradingSessionComplete,
    tradingSession?.apiCredentials,
  ]);

  return { clobClient };
}
