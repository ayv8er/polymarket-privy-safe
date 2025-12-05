import { useCallback } from "react";
import { RelayClient } from "@polymarket/builder-relayer-client";
import { checkAllApprovals, createAllApprovalTxs } from "@/utils/approvals";

// Uses relayClient to set all required token approvals for trading

export default function useTokenApprovals() {
  const checkAllTokenApprovals = useCallback(async (safeAddress: string) => {
    try {
      return await checkAllApprovals(safeAddress);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to check approvals");
      throw error;
    }
  }, []);

  const setAllTokenApprovals = useCallback(
    async (relayClient: RelayClient): Promise<boolean> => {
      try {
        const approvalTxs = createAllApprovalTxs();
        const response = await relayClient.execute(
          approvalTxs,
          "Set all token approvals for trading"
        );
        await response.wait();
        return true;
      } catch (err) {
        console.error("Failed to set all token approvals:", err);
        return false;
      }
    },
    []
  );

  return {
    checkAllTokenApprovals,
    setAllTokenApprovals,
  };
}
