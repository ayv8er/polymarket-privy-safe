import useAddressCopy from "@/hooks/useAddressCopy";
import { useWallet } from "@/providers/WalletContext";
import useSafeDeployment from "@/hooks/useSafeDeployment";

import InfoTooltip from "@/components/shared/InfoTooltip";

import { formatAddress } from "@/utils/formatting";

export default function WalletInfo({
  onDisconnect,
}: {
  onDisconnect: () => void;
}) {
  const { eoaAddress } = useWallet();
  const { derivedSafeAddressFromEoa } = useSafeDeployment(eoaAddress);
  const { copied: copiedSafe, copyAddress: copySafeAddress } = useAddressCopy(
    derivedSafeAddressFromEoa || null
  );

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
      <div className="flex flex-col gap-3">
        {/* EOA Wallet */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60 font-medium">
              EOA Wallet
            </span>
            <InfoTooltip text="This is your EOA wallet address. It is only used for signing transactions for the proxy wallet. Do not fund this address!" />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 transition-all select-none font-mono text-sm w-full sm:w-auto text-center">
            {eoaAddress && formatAddress(eoaAddress)}
          </div>
        </div>

        {/* Safe Wallet */}
        {derivedSafeAddressFromEoa && (
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-300 font-medium">
                Safe Wallet
              </span>
              <InfoTooltip text="This is your Safe wallet. It's controlled by your EOA and used for gasless transactions. Send USDC.e to this address." />
            </div>
            <button
              onClick={copySafeAddress}
              className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 rounded-lg px-4 py-2 transition-all select-none cursor-pointer font-mono text-sm text-blue-300 hover:text-blue-200 w-full sm:w-auto text-center"
            >
              {copiedSafe
                ? "Copied!"
                : formatAddress(derivedSafeAddressFromEoa)}
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between pt-2 border-t border-white/10">
          <div className="relative group w-full sm:w-auto">
            <button
              disabled
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 transition-all select-none cursor-not-allowed font-medium w-full sm:w-auto text-center text-white/40"
            >
              <span className="line-through">Polymarket Profile</span>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg border border-white/20 z-10 text-center">
              This Privy EOA does not have a corresponding Polymarket.com profile.
            </div>
          </div>
          <button
            onClick={onDisconnect}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg px-4 py-2 transition-all select-none cursor-pointer font-medium text-red-300 hover:text-red-200 w-full sm:w-auto text-center"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}
