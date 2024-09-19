import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useDebounce } from 'use-debounce'
import { useQuery } from '@tanstack/react-query'
import { swapQueryKeys } from './swapQueryKeys'
import { SimulateSwapInputs, SimulateSwapResponse } from '../swap.types'
import { isZero } from '@/lib/shared/utils/numbers'
import { getChainId } from '@/lib/config/app.config'
import { useBlockNumber } from 'wagmi'
import qs from 'qs'
import { useTokens } from '../../tokens/TokensProvider'
import { toUnits } from 'thirdweb'

export type SwapSimulationQueryResult = ReturnType<typeof useSimulateSwapQuery>

export type SimulateSwapParams = {
  swapInputs: SimulateSwapInputs
  enabled: boolean
}

export function useSimulateSwapQuery({
  swapInputs: { swapAmount, chain, tokenIn, tokenOut, swapType, taker },
  enabled = true,
}: SimulateSwapParams) {
  const debouncedSwapAmount = useDebounce(swapAmount, defaultDebounceMs)[0]
  console.log('taker', taker)
  const { getToken } = useTokens()
  const inputs = {
    swapAmount: debouncedSwapAmount,
    swapType,
    tokenIn,
    tokenOut,
    chain,
    taker,
  }

  const chainId = getChainId(chain)
  const { data: blockNumber } = useBlockNumber({ chainId })

  const queryKey = swapQueryKeys.simulation(inputs)

  const queryFn = async (): Promise<SimulateSwapResponse> => {
    const tokenInInfo = getToken(tokenIn, chain)
    const tokenOutInfo = getToken(tokenOut, chain)

    if (!tokenInInfo || !tokenOutInfo) {
      throw new Error('Token information not found')
    }

    const amountInWei = toUnits(
      debouncedSwapAmount,
      swapType === 'EXACT_IN' ? tokenInInfo.decimals : tokenOutInfo.decimals
    )
    const params = {
      chainId,
      sellToken: tokenIn,
      buyToken: tokenOut,
      [swapType === 'EXACT_IN' ? 'sellAmount' : 'buyAmount']: amountInWei,
      taker,
      swapFeeRecipient: '0x75A94931B81d81C7a62b76DC0FcFAC77FbE1e917', // FEE_RECIPIENT
      swapFeeBps: '100', // AFFILIATE_FEE
      swapFeeToken: tokenOut,
      tradeSurplusRecipient: '0x75A94931B81d81C7a62b76DC0FcFAC77FbE1e917', // FEE_RECIPIENT
    }

    const response = await fetch(`/api/price?${qs.stringify(params)}`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    
    return {
      ...data,
      swapType
    }
  }

  return useQuery<SimulateSwapResponse, Error>({
    queryKey,
    queryFn,
    enabled: enabled && !isZero(debouncedSwapAmount),
    gcTime: 0,
    ...onlyExplicitRefetch,
  })
}