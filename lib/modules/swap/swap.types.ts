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
  userAddress: Address
}

export type SimulateSwapInputs = {
  chain: GqlChain
  tokenIn: SwapTokenInput
  tokenOut: SwapTokenInput
  swapType: GqlSorSwapType
  swapAmount: string
  userAddress?: Address
  feeRecipient?: Address
  affiliateFee?: number
}

type ApiSwapQuery = GetSorSwapsQuery['swaps']

export interface SimulateSwapResponse0x {
  returnAmount: string
  swapType: GqlSorSwapType
  effectivePrice: string
  effectivePriceReversed: string
  swap: Swap
  queryOutput: any
}

export interface SimulateSwapResponse {
  blockNumber: string
  buyAmount: string
  buyToken: string
  sellAmount: string
  sellToken: string
  fees: {
    integratorFee: {
      amount: string
      token: string
      type: string
    }
    zeroExFee: {
      amount: string
      token: string
      type: string
    }
    gasFee: null
  }
  gas: string
  gasPrice: string
  issues: {
    allowance: {
      actual: string
      spender: string
    }
    balance: {
      token: string
      actual: string
      expected: string
    }
    simulationIncomplete: boolean
    invalidSourcesPassed: any[]
  }
  liquidityAvailable: boolean
  minBuyAmount: string
  route: {
    fills: Array<{
      from: string
      to: string
      source: string
      proportionBps: string
    }>
    tokens: Array<{
      address: string
      symbol: string
    }>
  }
  tokenMetadata: {
    buyToken: {
      buyTaxBps: string
      sellTaxBps: string
    }
    sellToken: {
      buyTaxBps: string
      sellTaxBps: string
    }
  }
  totalNetworkFee: string
  zid: string
}

export interface SdkSimulateSwapResponse extends SimulateSwapResponse, ApiSwapQuery {
  swap: Swap
  queryOutput: ExactInQueryOutput | ExactOutQueryOutput
}

export interface AuraBalSimulateSwapResponse extends SimulateSwapResponse {
  queryOutput: AuraBalSwapQueryOutput
}

export interface BuildSwapInputs extends SwapState {
  account: Address
  slippagePercent: string
  simulateResponse: SimulateSwapResponse0x
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
