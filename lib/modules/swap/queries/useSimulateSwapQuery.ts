'use client'

import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useDebounce } from 'use-debounce'
import { useQuery } from '@tanstack/react-query'
import { SwapHandler } from '../handlers/Swap.handler'
import { swapQueryKeys } from './swapQueryKeys'
import { SimulateSwapInputs, SimulateSwapResponse, SimulateSwapResponse0x } from '../swap.types'
import { isZero } from '@/lib/shared/utils/numbers'
import { getChainId } from '@/lib/config/app.config'
import { useBlockNumber } from 'wagmi'

export type SwapSimulationQueryResult = ReturnType<typeof useSimulateSwapQuery>

export type SimulateSwapParams = {
  handler: SwapHandler
  swapInputs: SimulateSwapInputs
  enabled: boolean
}

export function useSimulateSwapQuery({
  handler,
  swapInputs: {
    swapAmount,
    chain,
    tokenIn,
    tokenOut,
    swapType,
    userAddress,
    feeRecipient,
    affiliateFee,
  },
  enabled = true,
}: SimulateSwapParams) {
  const debouncedSwapAmount = useDebounce(swapAmount, defaultDebounceMs)[0]

  const inputs = {
    swapAmount: debouncedSwapAmount,
    swapType,
    tokenIn,
    tokenOut,
    chain,
    userAddress,
    feeRecipient,
    affiliateFee,
  }

  console.log('useSimulateSwapQuery inputs:', inputs)

  const chainId = getChainId(chain)
  const { data: blockNumber } = useBlockNumber({ chainId })

  const queryKey = swapQueryKeys.simulation(inputs)
  const queryFn = async () => handler.simulate(inputs)

  return useQuery<SimulateSwapResponse0x, Error>({
    queryKey,
    queryFn,
    enabled: enabled && !isZero(debouncedSwapAmount),
    gcTime: 0,
    ...onlyExplicitRefetch,
  })
}
