import type { TradingSession } from "@/utils/session";

export default function SessionSuccess({
  session,
}: {
  session: TradingSession;
}) {
  return (
    <div className="text-sm text-gray-300 bg-green-500/10 border border-green-500/20 rounded p-4 mb-4">
      <p className="font-medium mb-2">Ready to Trade</p>
      <div className="text-xs leading-relaxed text-gray-400 space-y-1">
        <ul className="space-y-1 ml-4 list-disc">
          <li>Safe deployed at: {session.safeAddress}</li>
          <li>
            User's API credentials created / derived, and stored in session
          </li>
          <li>All token approvals set for trading</li>
        </ul>
      </div>
    </div>
  );
}
