import {
  GetSorSwapsQuery,
  GqlChain,
  GqlSorSwapType,
} from '@/lib/shared/services/api/generated/graphql'
import {
  AuraBalSwapQueryOutput,
  ExactInQueryOutput,
  ExactOutQueryOutput,
  Swap,
} from '@balancer/sdk'
import { Address, Hex } from 'viem'

export type SwapTokenInput = {
  address: Address
  amount: string
  scaledAmount: bigint
}

export type SwapState = {
  tokenIn: SwapTokenInput
  tokenOut: SwapTokenInput
  swapType: GqlSorSwapType
  selectedChain: GqlChain
}

export type SimulateSwapInputs = {
  chain: GqlChain
  tokenIn: Address
  tokenOut: Address
  swapType: GqlSorSwapType
  swapAmount: string
  taker?: Address
}

type ApiSwapQuery = GetSorSwapsQuery['swaps']

export interface SimulateSwapResponse {
  blockNumber: string;
  buyAmount: string;
  buyToken: string;
  sellAmount: string;
  sellToken: string;
  swapType: GqlSorSwapType;
  fees: {
    integratorFee: {
      amount: string;
      token: string;
      type: string;
    };
    zeroExFee: {
      amount: string;
      token: string;
      type: string;
    };
    gasFee: null;
  };
  gas: string;
  gasPrice: string;
  issues: {
    allowance: {
      actual: string;
      spender: string;
    };
    balance: {
      token: string;
      actual: string;
      expected: string;
    };
    simulationIncomplete: boolean;
    invalidSourcesPassed: any[];
  };
  liquidityAvailable: boolean;
  minBuyAmount: string;
  route: {
    fills: Array<{
      from: string;
      to: string;
      source: string;
      proportionBps: string;
    }>;
    tokens: Array<{
      address: string;
      symbol: string;
    }>;
  };
  tokenMetadata: {
    buyToken: {
      buyTaxBps: string;
      sellTaxBps: string;
    };
    sellToken: {
      buyTaxBps: string;
      sellTaxBps: string;
    };
  };
  totalNetworkFee: string;
  zid: string;
}

export interface SdkSimulateSwapResponse extends SimulateSwapResponse {
  swap: Swap;
  queryOutput: ExactInQueryOutput | ExactOutQueryOutput;
  // Add any additional fields from ApiSwapQuery that are not in SimulateSwapResponse
  __typename?: 'GqlSorGetSwapPaths';
  swapAmount?: string;
  tokenIn?: string;
  tokenOut?: string;
  paths?: Array<{
    __typename?: 'GqlSorPath';
    inputAmountRaw: string;
    outputAmountRaw: string;
    pools: Array<string>;
    protocolVersion: number;
    tokens: Array<{ __typename?: 'Token'; address: string; decimals: number }>;
  }>;
  routes?: Array<{
    __typename?: 'GqlSorSwapRoute';
    share: number;
    tokenInAmount: string;
    tokenOut: string;
    tokenOutAmount: string;
    hops: Array<{
      __typename?: 'GqlSorSwapRouteHop';
      poolId: string;
      tokenIn: string;
      tokenInAmount: string;
      tokenOut: string;
      tokenOutAmount: string;
      pool: { __typename?: 'GqlPoolMinimal'; symbol: string };
    }>;
  }>;
  swaps?: Array<{
    __typename?: 'GqlSorSwap';
    amount: string;
    assetInIndex: number;
    assetOutIndex: number;
    poolId: string;
    userData: string;
  }>;
}

export interface AuraBalSimulateSwapResponse extends SimulateSwapResponse {
  queryOutput: AuraBalSwapQueryOutput
}

export interface BuildSwapInputs extends SwapState {
  account: Address
  slippagePercent: string
  simulateResponse: SimulateSwapResponse
  wethIsEth: boolean
  relayerApprovalSignature?: Hex
}

export interface SdkBuildSwapInputs extends BuildSwapInputs {
  simulateResponse: SdkSimulateSwapResponse
}

export interface AuraBalBuildSwapInputs extends BuildSwapInputs {
  simulateResponse: AuraBalSimulateSwapResponse
}

export enum SupportedWrapHandler {
  LIDO = 'LIDO',
}

export const OWrapType = {
  WRAP: 'wrap',
  UNWRAP: 'unwrap',
} as const

export type WrapType = (typeof OWrapType)[keyof typeof OWrapType]

export const OSwapAction = {
  ...OWrapType,
  SWAP: 'swap',
} as const

export type SwapAction = (typeof OSwapAction)[keyof typeof OSwapAction]
