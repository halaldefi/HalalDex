'use client'

import { arbitrum, base, Chain as WagmiChain, mainnet, polygon, sepolia } from 'wagmi/chains'

export interface Chain extends WagmiChain {
  iconUrl?: string
}

import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { keyBy } from 'lodash'
import { getBaseUrl } from '@/lib/shared/utils/urls'
import { isSupportedGqlChain, SupportedGqlChain } from '../tokens/SupportedChains'

/* If a request with the default rpc fails, it will fall back to the next one in the list.
  https://viem.sh/docs/clients/transports/fallback#fallback-transport
*/
// src/lib/chains/rpc.ts

export const rpcFallbacks: Record<SupportedGqlChain, string | undefined> = {
  [GqlChain.Mainnet]: 'https://eth.llamarpc.com',
  [GqlChain.Arbitrum]: 'https://arbitrum.llamarpc.com',
  [GqlChain.Base]: 'https://base.llamarpc.com',
  [GqlChain.Polygon]: 'https://polygon.llamarpc.com',
}

const baseUrl = getBaseUrl()

export const rpcOverrides: Record<SupportedGqlChain, string | undefined> = {
  [GqlChain.Mainnet]: `${baseUrl}/api/rpc/${GqlChain.Mainnet}`,
  [GqlChain.Arbitrum]: `${baseUrl}/api/rpc/${GqlChain.Arbitrum}`,
  [GqlChain.Base]: `${baseUrl}/api/rpc/${GqlChain.Base}`,
  [GqlChain.Polygon]: `${baseUrl}/api/rpc/${GqlChain.Polygon}`,
}

const customMainnet = { iconUrl: '/images/chains/MAINNET.svg', ...mainnet }

export const gqlChainToWagmiChainMap: Record<SupportedGqlChain, Chain> = {
  [GqlChain.Mainnet]: { iconUrl: '/images/chains/MAINNET.svg', ...mainnet },
  [GqlChain.Arbitrum]: { iconUrl: '/images/chains/ARBITRUM.svg', ...arbitrum },
  [GqlChain.Base]: { iconUrl: '/images/chains/BASE.svg', ...base },
  [GqlChain.Polygon]: { iconUrl: '/images/chains/POLYGON.svg', ...polygon },
}
export const supportedNetworks = getProjectConfig().supportedNetworks
export const chains: readonly [Chain, ...Chain[]] = [
  gqlChainToWagmiChainMap[GqlChain.Mainnet], // Always include Mainnet as `customMainnet` if needed
  ...supportedNetworks
    .filter(isSupportedGqlChain) // Filter to only supported chains
    .map(gqlChain => gqlChainToWagmiChainMap[gqlChain]),
] as const

// Create a mapping from chain ID to Chain object
export const chainsByKey = keyBy(chains, 'id')

// Function to get the default RPC URL for a given chain ID
export function getDefaultRpcUrl(chainId: number): string | undefined {
  const chain = chainsByKey[chainId]
  return chain?.rpcUrls.default.http[0]
}
