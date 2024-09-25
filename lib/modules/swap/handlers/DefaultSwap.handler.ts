import { SwapHandler } from './Swap.handler'
import {
  SdkBuildSwapInputs,
  SimulateSwapInputs,
  SimulateSwapResponse,
  SimulateSwapResponse0x,
} from '../swap.types'
import { formatUnits } from 'viem'
import qs from 'qs'
import { GqlChain, GqlSorSwapType, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { getChainId } from '@/lib/config/app.config'
import { useTokens } from '../../tokens/TokensProvider'
import BigNumber from 'bignumber.js'
import { TransactionConfig } from '../../web3/contracts/contract.types'
import { scaleTokenAmount } from '../SwapProvider'
export class DefaultSwapHandler implements SwapHandler {
  name = 'DefaultSwapHandler'
  private getToken: (address: string, chain: GqlChain) => GqlToken | undefined

  constructor(private chain: GqlChain, private feeRecipient: string, private affiliateFee: number) {
    console.log('DefaultSwapHandler initialized')
    const { getToken } = useTokens()
    this.getToken = getToken
  }

  async simulate({
    tokenIn,
    tokenOut,
    swapAmount,
    swapType,
    userAddress,
  }: SimulateSwapInputs): Promise<SimulateSwapResponse0x> {
    const params = {
      chainId: getChainId(this.chain),
      sellToken: tokenIn.address,
      buyToken: tokenOut.address,
      sellAmount: swapType === GqlSorSwapType.ExactIn ? swapAmount : undefined,
      buyAmount: swapType === GqlSorSwapType.ExactOut ? swapAmount : undefined,
      swapFeeRecipient: this.feeRecipient,
      swapFeeBps: this.affiliateFee,
      tradeSurplusRecipient: this.feeRecipient,
      swapFeeToken: swapType === GqlSorSwapType.ExactIn ? tokenIn.address : tokenOut.address,
      taker: userAddress,
    }
    try {
      const response = await fetch(`/api/price?${qs.stringify(params)}`)
      const data = await response.json()

      if (data?.validationErrors?.length > 0) {
        throw new Error(data.validationErrors.join(', '))
      }

      const sellTokenInfo = this.getToken(data.sellToken, this.chain)
      const buyTokenInfo = this.getToken(data.buyToken, this.chain)

      if (!sellTokenInfo || !buyTokenInfo) {
        throw new Error('Token information not found')
      }

      const sellAmountBn = BigNumber(data.sellAmount)
      const buyAmountBn = BigNumber(data.buyAmount)

      return {
        effectivePrice: sellAmountBn.div(buyAmountBn).toString(),
        effectivePriceReversed: buyAmountBn.div(sellAmountBn).toString(),
        returnAmount:
          swapType === GqlSorSwapType.ExactIn
            ? formatUnits(data.buyAmount, buyTokenInfo.decimals)
            : formatUnits(data.sellAmount, sellTokenInfo.decimals),
        swapType,
      }
    } catch (error) {
      console.error('Error in DefaultSwapHandler simulate:', error)
      throw error
    }
  }

  async getQuote(params: SimulateSwapInputs): Promise<any> {
    const { tokenIn, tokenOut, swapAmount, swapType, userAddress } = params
    const sellTokenInfo = this.getToken(tokenIn.address, this.chain)
    const buyTokenInfo = this.getToken(tokenOut.address, this.chain)
    if (!sellTokenInfo || !buyTokenInfo) {
      throw new Error('Token information not found')
    }
    const sellSwapAmount = scaleTokenAmount(swapAmount, sellTokenInfo)
    const buySwapAmount = scaleTokenAmount(swapAmount, buyTokenInfo)

    const getScaledSwapAmount = (sellSwapAmount: bigint, buySwapAmount: bigint) =>
      params.swapType === GqlSorSwapType.ExactIn ? sellSwapAmount : buySwapAmount || BigInt(0)
    const newSwapAmount = getScaledSwapAmount(sellSwapAmount, buySwapAmount)
    // convert swap amount to base units
    const quoteParams = {
      chainId: getChainId(this.chain),
      sellToken: tokenIn.address,
      buyToken: tokenOut.address,
      sellAmount: swapType === GqlSorSwapType.ExactIn ? newSwapAmount : undefined,
      buyAmount: swapType === GqlSorSwapType.ExactOut ? newSwapAmount : undefined,
      swapFeeRecipient: this.feeRecipient,
      swapFeeBps: this.affiliateFee,
      tradeSurplusRecipient: this.feeRecipient,
      swapFeeToken: swapType === GqlSorSwapType.ExactIn ? tokenIn.address : tokenOut.address,
      taker: userAddress,
    }

    try {
      const response = await fetch(`/api/quote?${qs.stringify(quoteParams)}`)
      const data = await response.json()

      if (data.validationErrors?.length > 0) {
        throw new Error(data.validationErrors.join(', '))
      }

      return data
    } catch (error) {
      console.error('Error in DefaultSwapHandler getQuote:', error)
      throw error
    }
  }
  buildTransaction(quoteResponse: any): TransactionConfig {
    return {
      to: quoteResponse.to,
      data: quoteResponse.data,
      value: quoteResponse.value,
      chainId: getChainId(this.chain),
      account: quoteResponse.from,
    }
  }
}
