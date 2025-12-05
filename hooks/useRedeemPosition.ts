import { useState, useCallback } from "react";
import { RelayClient } from "@polymarket/builder-relayer-client";
import { createRedeemTx, RedeemParams } from "@/utils/redeem";

export default function useRedeemPosition() {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const redeemPosition = useCallback(
    async (
      relayClient: RelayClient,
      params: RedeemParams
    ): Promise<boolean> => {
      setIsRedeeming(true);
      setError(null);

      try {
        const redeemTx = createRedeemTx(params);

        // Using execute() method as per your existing pattern
        const response = await relayClient.execute(
          [redeemTx],
          `Redeem position for condition ${params.conditionId}`
        );

        await response.wait();
        return true;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to redeem position");
        setError(error);
        console.error("Redeem error:", error);
        throw error;
      } finally {
        setIsRedeeming(false);
      }
    },
    []
  );

  return {
    isRedeeming,
    error,
    redeemPosition,
  };
}
