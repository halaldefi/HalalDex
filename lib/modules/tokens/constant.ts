import { SupportedChainId } from '@/lib/config/tokenConfig'

export const TOKENS_BY_CHAIN = {
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
      // ...
    ],
    otherTokens: [],
  },
  // Add token information for other supported chains
}
