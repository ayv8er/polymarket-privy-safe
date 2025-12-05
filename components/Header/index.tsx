"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useWallet } from "@/providers/WalletContext";
import WalletInfo from "@/components/Header/WalletInfo";

export default function Header({
  onEndSession,
}: {
  onEndSession?: () => void;
}) {
  const { eoaAddress } = useWallet();
  const { login, logout } = usePrivy();

  const handleConnect = async () => {
    login();
  };

  const handleDisconnect = async () => {
    onEndSession?.();
    logout();
  };

  return (
    <div className="flex flex-col items-center relative">
      {eoaAddress ? (
        <WalletInfo onDisconnect={handleDisconnect} />
      ) : (
        <button
          className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-3 hover:bg-white/20 cursor-pointer transition-colors font-semibold select-none"
          onClick={handleConnect}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
