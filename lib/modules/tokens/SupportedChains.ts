import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

export type SupportedGqlChain =
  | GqlChain.Mainnet
  | GqlChain.Arbitrum
  | GqlChain.Base
  | GqlChain.Polygon

export const SUPPORTED_GQL_CHAINS: SupportedGqlChain[] = [
  GqlChain.Mainnet,
  GqlChain.Arbitrum,
  GqlChain.Base,
  GqlChain.Polygon,
]

// src/lib/chains/SupportedChains.ts
export function isSupportedGqlChain(chain: GqlChain): chain is SupportedGqlChain {
  return SUPPORTED_GQL_CHAINS.includes(chain as SupportedGqlChain)
}
