import { createPublicClient, http } from "viem";
import {
  OperationType,
  SafeTransaction,
} from "@polymarket/builder-relayer-client";
import { polygon } from "viem/chains";
import { Interface } from "ethers/lib/utils";
import {
  USDC_E_CONTRACT_ADDRESS,
  CTF_CONTRACT_ADDRESS,
  CTF_EXCHANGE_ADDRESS,
  NEG_RISK_CTF_EXCHANGE_ADDRESS,
  NEG_RISK_ADAPTER_ADDRESS,
} from "@/constants/tokens";
import { POLYGON_RPC_URL } from "@/constants/polymarket";

const MAX_UINT256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

const erc20Interface = new Interface([
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
]);

const erc1155Interface = new Interface([
  {
    constant: false,
    inputs: [
      { name: "_operator", type: "address" },
      { name: "_approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
]);

const ERC20_ABI = [
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const ERC1155_ABI = [
  {
    inputs: [
      { name: "account", type: "address" },
      { name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const publicClient = createPublicClient({
  chain: polygon,
  transport: http(POLYGON_RPC_URL),
});

const USDC_E_SPENDERS = [
  { address: CTF_CONTRACT_ADDRESS, name: "CTF Contract" },
  { address: NEG_RISK_ADAPTER_ADDRESS, name: "Neg Risk Adapter" },
  { address: CTF_EXCHANGE_ADDRESS, name: "CTF Exchange" },
  { address: NEG_RISK_CTF_EXCHANGE_ADDRESS, name: "Neg Risk CTF Exchange" },
] as const;

const OUTCOME_TOKEN_SPENDERS = [
  { address: CTF_EXCHANGE_ADDRESS, name: "CTF Exchange" },
  { address: NEG_RISK_CTF_EXCHANGE_ADDRESS, name: "Neg Risk Exchange" },
  { address: NEG_RISK_ADAPTER_ADDRESS, name: "Neg Risk Adapter" },
] as const;

const checkUSDCApprovalForSpender = async (
  safeAddress: string,
  spender: string
): Promise<boolean> => {
  try {
    const allowance = await publicClient.readContract({
      address: USDC_E_CONTRACT_ADDRESS as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [safeAddress as `0x${string}`, spender as `0x${string}`],
    });

    const threshold = BigInt("1000000000000");
    return allowance >= threshold;
  } catch (error) {
    console.warn(`Failed to check USDC approval for ${spender}:`, error);
    return false;
  }
};

const checkERC1155ApprovalForSpender = async (
  safeAddress: string,
  spender: string
): Promise<boolean> => {
  try {
    const isApproved = await publicClient.readContract({
      address: CTF_CONTRACT_ADDRESS as `0x${string}`,
      abi: ERC1155_ABI,
      functionName: "isApprovedForAll",
      args: [safeAddress as `0x${string}`, spender as `0x${string}`],
    });

    return isApproved;
  } catch (error) {
    console.warn(`Failed to check ERC1155 approval for ${spender}:`, error);
    return false;
  }
};

export const checkAllApprovals = async (
  safeAddress: string
): Promise<{
  allApproved: boolean;
  usdcApprovals: Record<string, boolean>;
  outcomeTokenApprovals: Record<string, boolean>;
}> => {
  const usdcApprovals: Record<string, boolean> = {};
  const outcomeTokenApprovals: Record<string, boolean> = {};

  await Promise.all(
    USDC_E_SPENDERS.map(async ({ address, name }) => {
      usdcApprovals[name] = await checkUSDCApprovalForSpender(
        safeAddress,
        address
      );
    })
  );

  await Promise.all(
    OUTCOME_TOKEN_SPENDERS.map(async ({ address, name }) => {
      outcomeTokenApprovals[name] = await checkERC1155ApprovalForSpender(
        safeAddress,
        address
      );
    })
  );

  const allApproved =
    Object.values(usdcApprovals).every((approved) => approved) &&
    Object.values(outcomeTokenApprovals).every((approved) => approved);

  return {
    allApproved,
    usdcApprovals,
    outcomeTokenApprovals,
  };
};

export const createAllApprovalTxs = (): SafeTransaction[] => {
  const safeTxns: SafeTransaction[] = [];

  for (const { address } of USDC_E_SPENDERS) {
    safeTxns.push({
      to: USDC_E_CONTRACT_ADDRESS,
      operation: OperationType.Call,
      data: erc20Interface.encodeFunctionData("approve", [
        address,
        MAX_UINT256,
      ]),
      value: "0",
    });
  }

  for (const { address } of OUTCOME_TOKEN_SPENDERS) {
    safeTxns.push({
      to: CTF_CONTRACT_ADDRESS,
      operation: OperationType.Call,
      data: erc1155Interface.encodeFunctionData("setApprovalForAll", [
        address,
        true,
      ]),
      value: "0",
    });
  }

  return safeTxns;
};
