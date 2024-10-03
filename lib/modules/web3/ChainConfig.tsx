'use client'

import { arbitrum, base, Chain as WagmiChain, mainnet, polygon, sepolia, bsc } from 'wagmi/chains'

export interface Chain extends WagmiChain {
  iconUrl?: string
}

import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { GqlChain } from '@/lib/modules/tokens/SupportedChains'
import { keyBy } from 'lodash'
import { getBaseUrl } from '@/lib/shared/utils/urls'

/* If a request with the default rpc fails, it will fall back to the next one in the list.
  https://viem.sh/docs/clients/transports/fallback#fallback-transport
*/
export const rpcFallbacks: Record<GqlChain, string | undefined> = {
  [GqlChain.Mainnet]: 'https://eth.llamarpc.com',
  [GqlChain.Arbitrum]: 'https://arbitrum.llamarpc.com',
  [GqlChain.Base]: 'https://base.llamarpc.com',
  [GqlChain.Polygon]: 'https://polygon.llamarpc.com',
  [GqlChain.Sepolia]: 'https://sepolia.gateway.tenderly.co',
  [GqlChain.BSC]: 'https://binance.llamarpc.com',
}

const baseUrl = getBaseUrl()
const getPrivateRpcUrl = (chain: GqlChain) => `${baseUrl}/api/rpc/${chain}`

export const rpcOverrides: Record<GqlChain, string | undefined> = {
  [GqlChain.Mainnet]: getPrivateRpcUrl(GqlChain.Mainnet),
  [GqlChain.Arbitrum]: getPrivateRpcUrl(GqlChain.Arbitrum),
  [GqlChain.Base]: getPrivateRpcUrl(GqlChain.Base),
  [GqlChain.Polygon]: getPrivateRpcUrl(GqlChain.Polygon),
  [GqlChain.Sepolia]: getPrivateRpcUrl(GqlChain.Sepolia),
  [GqlChain.BSC]: getPrivateRpcUrl(GqlChain.BSC),
}

const customMainnet = { iconUrl: '/images/chains/MAINNET.svg', ...mainnet }
const gqlChainToWagmiChainMap = {
  [GqlChain.Mainnet]: customMainnet,
  [GqlChain.Arbitrum]: { iconUrl: '/images/chains/ARBITRUM.svg', ...arbitrum },
  [GqlChain.Base]: { iconUrl: '/images/chains/BASE.svg', ...base },
  [GqlChain.Polygon]: { iconUrl: '/images/chains/POLYGON.svg', ...polygon },
  [GqlChain.Sepolia]: { iconUrl: '/images/chains/SEPOLIA.svg', ...sepolia },
  [GqlChain.BSC]: { iconUrl: '/images/chains/BSC.svg', ...bsc },
} as const satisfies Record<GqlChain, Chain>

export const supportedNetworks = getProjectConfig().supportedNetworks
export const chains: readonly [Chain, ...Chain[]] = [
  customMainnet,
  ...supportedNetworks
    .filter(chain => chain !== GqlChain.Mainnet)
    .map(gqlChain => gqlChainToWagmiChainMap[gqlChain]),
]

export const chainsByKey = keyBy(chains, 'id')
export function getDefaultRpcUrl(chainId: number) {
  return chainsByKey[chainId].rpcUrls.default.http[0]
}
