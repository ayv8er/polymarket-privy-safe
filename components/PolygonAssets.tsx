"use client";

import { useWallet } from "@/providers/WalletContext";
import useSafeDeployment from "@/hooks/useSafeDeployment";
import usePolygonBalances from "@/hooks/usePolygonBalances";

import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";

export default function PolygonAssets() {
  const { eoaAddress } = useWallet();
  const { derivedSafeAddressFromEoa } = useSafeDeployment(eoaAddress);
  const { formattedUsdcBalance, isLoading, isError } = usePolygonBalances(
    derivedSafeAddressFromEoa
  );

  if (!derivedSafeAddressFromEoa) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Trading Balance</h2>
        <p className="text-center text-white/70">Loading balance...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Trading Balance</h2>
        <p className="text-center text-red-400">Error loading balance</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Trading Balance</h2>
      </div>

      <div className="bg-white/5 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-white/70">USDC.e</h3>
          <Badge className="text-xs px-2 py-1">Polygon</Badge>
        </div>

        <p className="text-5xl font-bold">${formattedUsdcBalance}</p>
      </div>
    </Card>
  );
}
