import { SwapHandler } from './Swap.handler'
import { SimulateSwapInputs, SimulateSwapResponse } from '../swap.types'
import { formatUnits } from 'viem'
import qs from 'qs'
import { GqlChain, GqlSorSwapType, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { getChainId } from '@/lib/config/app.config'
import { useTokens } from '../../tokens/TokensProvider'
import BigNumber from 'bignumber.js'

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
  }: SimulateSwapInputs): Promise<any> {
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

      let returnAmount: string
      if (swapType === GqlSorSwapType.ExactIn) {
        console.log('DefaultSwapHandler simulate: swapType ExactIn')
        console.log('DefaultSwapHandler simulate: sellAmount', data.sellAmount)
        console.log('DefaultSwapHandler simulate: buyAmount', data.buyAmount)
        console.log('DefaultSwapHandler simulate: sellTokenInfo.decimals', sellTokenInfo.decimals)
        console.log('DefaultSwapHandler simulate: buyTokenInfo.decimals', buyTokenInfo.decimals)
        returnAmount = formatUnits(data.buyAmount, buyTokenInfo.decimals)
      } else {
        console.log('DefaultSwapHandler simulate: swapType ExactOut')
        console.log('DefaultSwapHandler simulate: sellAmount', data.sellAmount)
        console.log('DefaultSwapHandler simulate: buyAmount', data.buyAmount)
        console.log('DefaultSwapHandler simulate: sellTokenInfo.decimals', sellTokenInfo.decimals)
        console.log('DefaultSwapHandler simulate: buyTokenInfo.decimals', buyTokenInfo.decimals)
        returnAmount = formatUnits(data.sellAmount, sellTokenInfo.decimals)
      }

      return {
        effectivePrice: sellAmountBn.div(buyAmountBn).toString(),
        effectivePriceReversed: buyAmountBn.div(sellAmountBn).toString(),
        returnAmount,
        swapType,
      }
    } catch (error) {
      console.error('Error in DefaultSwapHandler simulate:', error)
      throw error
    }
  }

  async getQuote(params: SimulateSwapInputs): Promise<any> {
    try {
      // Use the quote endpoint for getting the actual swap quote
      const response = await fetch(`/api/quote?${qs.stringify(params)}`)
      const data = await response.json()

      if (data?.validationErrors?.length > 0) {
        throw new Error(data.validationErrors.join(', '))
      }

      return data
    } catch (error) {
      console.error('Error in DefaultSwapHandler getQuote:', error)
      throw error
    }
  }
}
