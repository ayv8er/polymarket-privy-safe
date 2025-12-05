"use client";

import { createContext, useContext, ReactNode } from "react";
import type { ClobClient } from "@polymarket/clob-client";
import type { RelayClient } from "@polymarket/builder-relayer-client";
import { useWallet } from "@/providers/WalletContext";
import useClobClient from "@/hooks/useClobClient";
import useTradingSession from "@/hooks/useTradingSession";
import useSafeDeployment from "@/hooks/useSafeDeployment";
import { TradingSession, SessionStep } from "@/utils/session";

interface TradingContextType {
  tradingSession: TradingSession | null;
  currentStep: SessionStep;
  sessionError: Error | null;
  isTradingSessionComplete: boolean | undefined;
  initializeTradingSession: () => Promise<void>;
  endTradingSession: () => void;
  clobClient: ClobClient | null;
  relayClient: RelayClient | null;
  eoaAddress: string | undefined;
  safeAddress: string | undefined;
}

const TradingContext = createContext<TradingContextType | null>(null);

export function useTrading() {
  const ctx = useContext(TradingContext);
  if (!ctx) throw new Error("useTrading must be used within TradingProvider");
  return ctx;
}

export default function TradingProvider({ children }: { children: ReactNode }) {
  const { eoaAddress } = useWallet();
  const { derivedSafeAddressFromEoa } = useSafeDeployment(eoaAddress);

  const {
    tradingSession,
    currentStep,
    sessionError,
    isTradingSessionComplete,
    initializeTradingSession,
    endTradingSession,
    relayClient,
  } = useTradingSession();

  const { clobClient } = useClobClient(
    tradingSession,
    isTradingSessionComplete
  );

  return (
    <TradingContext.Provider
      value={{
        tradingSession,
        currentStep,
        sessionError,
        isTradingSessionComplete,
        initializeTradingSession,
        endTradingSession,
        clobClient,
        relayClient,
        eoaAddress,
        safeAddress: derivedSafeAddressFromEoa,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
}
