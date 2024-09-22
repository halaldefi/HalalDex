import { SwapHandler } from './Swap.handler'
import { SimulateSwapInputs } from '../swap.types'
import { formatUnits, parseUnits } from 'viem'
import qs from 'qs'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { getChainId } from '@/lib/config/app.config'
import { useTokens } from '../../tokens/TokensProvider'
import { Token } from '@balancer/sdk'

export class DefaultSwapHandler implements SwapHandler {
  name = 'DefaultSwapHandler'
  constructor(private chain: GqlChain, private feeRecipient: string, private affiliateFee: number) {
    console.log('DefaultSwapHandler initialized')
  }

  //TODOs: Fix the formats of sellAmount and buyAmount
  async simulate({
    tokenIn,
    tokenOut,
    swapAmount,
    swapType,
    userAddress,
  }: SimulateSwapInputs): Promise<any> {
    const params: {
      chainId: number
      sellToken: string
      buyToken: string
      sellAmount?: string
      buyAmount?: string
      swapFeeRecipient: string
      swapFeeBps: number
      tradeSurplusRecipient: string
      taker?: string
      swapFeeToken?: string
    } = {
      chainId: getChainId(this.chain),
      sellToken: tokenIn.address,
      buyToken: tokenOut.address,
      sellAmount: swapType === 'EXACT_IN' ? swapAmount : undefined,
      buyAmount: swapType === 'EXACT_OUT' ? swapAmount : undefined,
      swapFeeRecipient: this.feeRecipient,
      swapFeeBps: this.affiliateFee,
      tradeSurplusRecipient: this.feeRecipient,
      swapFeeToken: swapType === 'EXACT_IN' ? tokenIn.address : tokenOut.address,
      // Add any other necessary parameters
    }
    if (userAddress) {
      params.taker = userAddress
    }

    try {
      // Use the price endpoint for simulation
      console.log('Simulating swap with params', params)
      const response = await fetch(`/api/price?${qs.stringify(params)}`)
      const data = await response.json()

      if (data?.validationErrors?.length > 0) {
        throw new Error(data.validationErrors.join(', '))
      }

      // Format buy amount if available
      let formattedBuyAmount
      if (data.buyAmount) {
        formattedBuyAmount = formatUnits(data.buyAmount, data.buyTokenDecimals)
      }

      return {
        ...data,
        formattedBuyAmount,
        sellTokenTax: data?.sellTokenToEthRate,
        buyTokenTax: data?.buyTokenToEthRate,
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
