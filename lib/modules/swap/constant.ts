import { Address } from 'thirdweb/utils'

export const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3'
export const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const MAGIC_CALLDATA_STRING = 'f'.repeat(130) // used when signing the eip712 message

export const AFFILIATE_FEE = 100 // 1% affiliate fee. Denoted in Bps.
export const FEE_RECIPIENT = '0x75A94931B81d81C7a62b76DC0FcFAC77FbE1e917' // The ETH address that should receive affiliate fees

export const MAINNET_EXCHANGE_PROXY = '0xdef1c0ded9bec7f1a1670819833240f027b25eff'

export const MAX_ALLOWANCE =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n
