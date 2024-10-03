import { GqlChain } from '@/lib/modules/tokens/SupportedChains'

import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 56,
  name: 'BNB Smart Chain',
  shortName: 'BSC',
  chain: GqlChain.Bsc,
  iconPath: '/images/chains/BSC.svg',
  blockExplorer: {
    baseUrl: 'https://bscscan.com',
    name: 'Bscscan',
  },
  tokens: {
    addresses: {
      bal: '0xe15bcb9e0ea69e6ab9fa080c4c4a5632896298c3',
      wNativeAsset: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    },
    nativeAsset: {
      name: 'BNB',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'BNB',
      decimals: 18,
    },
    defaultSwapTokens: {
      tokenIn: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    popularTokens: {
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'BNB',
      '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': 'WBNB',
    },
  },
  contracts: {
    multicall2: '',
    balancer: {
      vaultV2: '',
      vaultV3: undefined,
      relayerV6: '',
      minter: '',
    },
  },
}

export default networkConfig
