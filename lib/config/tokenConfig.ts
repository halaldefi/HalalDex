// src/config/tokenConfig.ts

import { Address } from 'thirdweb'

export enum SupportedChainId {
  MAINNET = 1,
  ARBITRUM = 42161,
  POLYGON = 137,
  BASE = 8453,
  BNB = 56,
}

export type ChainName = 'Ethereum' | 'Arbitrum' | 'Polygon' | 'Base' | 'BNB'

export interface TokenConfig {
  address: Address
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

export interface ChainConfig {
  name: ChainName
  nativeToken: TokenConfig
  wrappedNativeToken: TokenConfig
  stableTokens: TokenConfig[]
  otherTokens: TokenConfig[]
}
export const chainConfig: Record<SupportedChainId, ChainConfig> = {
  [SupportedChainId.MAINNET]: {
    name: 'Ethereum',
    nativeToken: {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      logoURI:
        'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
    },
    wrappedNativeToken: {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      decimals: 18,
      logoURI:
        'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
    },
    stableTokens: [
      {
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        name: 'Tether',
        symbol: 'USDT',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/325/thumb/Tether.png?1696501661',
      },
      {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/thumb/usdc.png?1696506694',
      },
    ],
    otherTokens: [
      {
        address: '0x582d872a1b094fc48f5de31d3b73f2d9be47def1',
        name: 'Toncoin',
        symbol: 'TON',
        decimals: 9,
        logoURI:
          'https://assets.coingecko.com/coins/images/17980/thumb/photo_2024-09-10_17.09.00.jpeg?1725963446',
      },
    ],
  },
  [SupportedChainId.ARBITRUM]: {
    name: 'Arbitrum',
    nativeToken: {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      logoURI:
        'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
    },
    wrappedNativeToken: {
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      logoURI:
        'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
    },
    stableTokens: [
      {
        address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        name: 'Arbitrum Bridged USDT (Arbitrum)',
        symbol: 'USDT',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/35073/thumb/logo.png?1707292836',
      },
      {
        address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/thumb/usdc.png?1696506694',
      },
    ],
    otherTokens: [],
  },
  [SupportedChainId.POLYGON]: {
    name: 'Polygon',
    nativeToken: {
      address: '0x0000000000000000000000000000000000001010',
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
      logoURI: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    },
    wrappedNativeToken: {
      address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      name: 'Polygon PoS Bridged WETH (Polygon POS)',
      symbol: 'WETH',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/39708/thumb/WETH.PNG?1723730343',
    },
    stableTokens: [
      {
        address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        name: 'Polygon Bridged USDT (Polygon)',
        symbol: 'USDT',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/35023/thumb/USDT.png?1707233644',
      },
      {
        address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/thumb/usdc.png?1696506694',
      },
    ],
    otherTokens: [],
  },
  [SupportedChainId.BASE]: {
    name: 'Base',
    nativeToken: {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      logoURI:
        'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
    },
    wrappedNativeToken: {
      address: '0x4200000000000000000000000000000000000006',
      name: 'L2 Standard Bridged WETH (Base)',
      symbol: 'WETH',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/39810/thumb/weth.png?1724139790',
    },
    stableTokens: [
      {
        address: '0xfde4c96c8593536e31f229ea8f37b2ada2699bb2',
        name: 'L2 Standard Bridged USDT (Base)',
        symbol: 'USDT',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/39963/thumb/usdt.png?1724952731',
      },
      {
        address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
        name: 'Bridged USDC (Base)',
        symbol: 'USDBC',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/31164/thumb/baseusdc.jpg?1696529993',
      },
    ],
    otherTokens: [],
  },
  [SupportedChainId.BNB]: {
    name: 'BNB',
    nativeToken: {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png?1696501970',
    },
    wrappedNativeToken: {
      address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      name: 'Binance Peg WETH',
      symbol: 'WETH',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/39580/thumb/weth.png?1723006716',
    },
    stableTokens: [
      {
        address: '0x55d398326f99059ff775485246999027b3197955',
        name: 'Binance Bridged USDT (BNB Smart Chain)',
        symbol: 'BSC-USD',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/35021/thumb/USDT.png?1707233575',
      },
      {
        address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        name: 'Binance Bridged USDC (BNB Smart Chain)',
        symbol: 'USDC',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/35220/thumb/USDC.jpg?1707919050',
      },
    ],
    otherTokens: [
      {
        address: '0x76a797a59ba2c17726896976b7b3747bfd1d220f',
        name: 'Toncoin',
        symbol: 'TON',
        decimals: 9,
        logoURI:
          'https://assets.coingecko.com/coins/images/17980/thumb/photo_2024-09-10_17.09.00.jpeg?1725963446',
      },
    ],
  },
}

export function getChainConfig(chainId: SupportedChainId): ChainConfig {
  return chainConfig[chainId]
}

export function getAllTokensForChain(chainId: SupportedChainId): TokenConfig[] {
  const config = getChainConfig(chainId)
  return [
    config.nativeToken,
    config.wrappedNativeToken,
    ...config.stableTokens,
    ...config.otherTokens,
  ]
}

export function getTokenByAddress(
  chainId: SupportedChainId,
  address: Address
): TokenConfig | undefined {
  return getAllTokensForChain(chainId).find(
    token => token.address.toLowerCase() === address.toLowerCase()
  )
}
