import { GqlChain } from '@/lib/modules/tokens/SupportedChains'

import { invert } from 'lodash'

// URL slug for each chain
export enum ChainSlug {
  Ethereum = 'ethereum',
  Arbitrum = 'arbitrum',
  Polygon = 'polygon',
  Avalanche = 'avalanche',
  Fantom = 'fantom',
  Base = 'base',
  Optimisim = 'optimism',
  Zkevm = 'zkevm',
  Gnosis = 'gnosis',
  Sepolia = 'sepolia',
  Mode = 'mode',
  Fraxtal = 'fraxtal',
}

// Maps GraphQL chain enum to URL slug
export const chainToSlugMap: Record<GqlChain, ChainSlug> = {
  [GqlChain.Mainnet]: ChainSlug.Ethereum,
  [GqlChain.Arbitrum]: ChainSlug.Arbitrum,
  [GqlChain.Polygon]: ChainSlug.Polygon,
  [GqlChain.Base]: ChainSlug.Base,
  [GqlChain.Sepolia]: ChainSlug.Sepolia,
}
export const slugToChainMap = invert(chainToSlugMap) as Record<ChainSlug, GqlChain>
