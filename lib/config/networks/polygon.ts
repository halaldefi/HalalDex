import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'
import { convertHexToLowerCase } from '@/lib/shared/utils/objects'
import { CSP_ISSUE_POOL_IDS } from '@/lib/shared/data/csp-issue'

const networkConfig: NetworkConfig = {
  chainId: 137,
  name: 'Polygon Mainnet',
  shortName: 'Polygon',
  chain: GqlChain.Polygon,
  iconPath: '/images/chains/POLYGON.svg',
  minConfirmations: 13,
  blockExplorer: {
    baseUrl: 'https://polygonscan.com',
    name: 'Polygonscan',
  },
  tokens: {
    addresses: {
      bal: '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3',
      wNativeAsset: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    },
    nativeAsset: {
      name: 'Pol',
      address: '0x0000000000000000000000000000000000001010',
      symbol: 'POL',
      decimals: 18,
    },
    defaultSwapTokens: {
      tokenIn: '0x0000000000000000000000000000000000001010',
    },
    popularTokens: {
      '0x0000000000000000000000000000000000001010': 'POL',
      '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270': 'WPOL',
      '0xfa68fb4628dff1028cfec22b4162fccd0d45efb6': 'MaticX',
      '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619': 'WETH',
      '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3': 'BAL',
      '0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4': 'stMATIC',
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': 'USDC',
      '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': 'USDT',
      '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063': 'DAI',
      '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6': 'WBTC',
      '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39': 'LINK',
      '0x1509706a6c66ca549ff0cb464de88231ddbe213b': 'AURA',
    },
  },
  contracts: {
    multicall2: '0x275617327c958bD06b5D6b871E7f491D76113dd8',
    balancer: {
      vaultV2: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      relayerV6: '0xB1ED8d3b5059b3281D43306cC9D043cE8B22599b',
      minter: '0x47B489bf5836f83ABD928C316F8e39bC0587B020',
    },
    veDelegationProxy: '0x0f08eEf2C785AA5e7539684aF04755dEC1347b7c',
  },
}

export default networkConfig
