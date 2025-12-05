import {
  OperationType,
  SafeTransaction,
} from "@polymarket/builder-relayer-client";
import { Interface } from "ethers/lib/utils";
import {
  USDC_E_CONTRACT_ADDRESS,
  CTF_CONTRACT_ADDRESS,
} from "@/constants/tokens";

const ctfInterface = new Interface([
  "function redeemPositions(address collateralToken, bytes32 parentCollectionId, bytes32 conditionId, uint[] indexSets)",
]);

export interface RedeemParams {
  conditionId: string;
  outcomeIndex: number;
}

export const createRedeemTx = (params: RedeemParams): SafeTransaction => {
  const { conditionId, outcomeIndex } = params;

  // For simple binary outcomes, parentCollectionId is empty
  const parentCollectionId = "0x" + "0".repeat(64);

  // indexSets array for the specific outcome
  const indexSet = 1 << outcomeIndex;
  const indexSets = [indexSet];

  const data = ctfInterface.encodeFunctionData("redeemPositions", [
    USDC_E_CONTRACT_ADDRESS,
    parentCollectionId,
    conditionId,
    indexSets,
  ]);

  return {
    to: CTF_CONTRACT_ADDRESS,
    operation: OperationType.Call,
    data,
    value: "0",
  };
};
