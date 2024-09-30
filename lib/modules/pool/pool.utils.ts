import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
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
  [GqlChain.Avalanche]: ChainSlug.Avalanche,
  [GqlChain.Fantom]: ChainSlug.Fantom,
  [GqlChain.Base]: ChainSlug.Base,
  [GqlChain.Optimism]: ChainSlug.Optimisim,
  [GqlChain.Zkevm]: ChainSlug.Zkevm,
  [GqlChain.Gnosis]: ChainSlug.Gnosis,
  [GqlChain.Sepolia]: ChainSlug.Sepolia,
  [GqlChain.Mode]: ChainSlug.Mode,
  [GqlChain.Fraxtal]: ChainSlug.Fraxtal,
}
export const slugToChainMap = invert(chainToSlugMap) as Record<ChainSlug, GqlChain>
