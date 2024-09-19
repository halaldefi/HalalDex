import { Address } from 'thirdweb/utils'

export const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3'
export const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const MAGIC_CALLDATA_STRING = 'f'.repeat(130) // used when signing the eip712 message

export const AFFILIATE_FEE = 100 // 1% affiliate fee. Denoted in Bps.
export const FEE_RECIPIENT = '0x75A94931B81d81C7a62b76DC0FcFAC77FbE1e917' // The ETH address that should receive affiliate fees

export const MAINNET_EXCHANGE_PROXY = '0xdef1c0ded9bec7f1a1670819833240f027b25eff'

export const MAX_ALLOWANCE =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n

interface Token {
  name: string
  address: Address
  symbol: string
  decimals: number
  chainId: number
  logoURI: string
}

const createToken = (
  chainId: number,
  name: string,
  symbol: string,
  decimals: number,
  address: `0x${string}`,
  logoURI: string
): Token => ({
  chainId,
  name,
  symbol,
  decimals,
  address,
  logoURI,
})

const createTokens = (tokens: [number, string, string, number, `0x${string}`, string][]): Token[] =>
  tokens.map(([chainId, name, symbol, decimals, address, logoURI]) =>
    createToken(chainId, name, symbol, decimals, address, logoURI)
  )

const logoBase =
  'https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/'

export const MAINNET_TOKENS = createTokens([
  [
    1,
    'Wrapped Ether',
    'WETH',
    18,
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    `${logoBase}weth.svg`,
  ],
  [1, 'USD Coin', 'USDC', 6, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', `${logoBase}usdc.svg`],
  [1, 'Dai - PoS', 'DAI', 18, '0x6b175474e89094c44da98b954eedeac495271d0f', `${logoBase}dai.svg`],
])

export const POLYGON_TOKENS = createTokens([
  [137, 'POL', 'POL', 18, NATIVE_TOKEN_ADDRESS, `${logoBase}matic.svg`],
  [137, 'USD Coin', 'USDC', 6, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', `${logoBase}usdc.svg`],
  [
    137,
    'USDT Coin',
    'USDT',
    6,
    '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    `${logoBase}usdt.svg`,
  ],
])

export const BNB_TOKENS = createTokens([
  [56, 'BNB', 'BNB', 18, NATIVE_TOKEN_ADDRESS, `${logoBase}bnb.svg`],
  [
    56,
    'USDT Coin',
    'USDT',
    18,
    '0x55d398326f99059ff775485246999027b3197955',
    `${logoBase}usdt.svg`,
  ],
])

const createTokenMap = (tokens: Token[]): Record<string, Token> =>
  Object.fromEntries(tokens.map(token => [token.symbol.toLowerCase(), token]))

const createTokenAddressMap = (tokens: Token[]): Record<string, Token> =>
  Object.fromEntries(tokens.map(token => [token.address, token]))

export const MAINNET_TOKENS_BY_SYMBOL = createTokenMap(MAINNET_TOKENS)
export const MAINNET_TOKENS_BY_ADDRESS = createTokenAddressMap(MAINNET_TOKENS)
export const POLYGON_TOKENS_BY_SYMBOL = createTokenMap(POLYGON_TOKENS)
export const POLYGON_TOKENS_BY_ADDRESS = createTokenAddressMap(POLYGON_TOKENS)
export const BNB_TOKENS_BY_SYMBOL = createTokenMap(BNB_TOKENS)
export const BNB_TOKENS_BY_ADDRESS = createTokenAddressMap(BNB_TOKENS)
