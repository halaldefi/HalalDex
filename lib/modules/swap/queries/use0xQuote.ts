import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { SimulateSwapInputs } from '../swap.types'
import { SwapHandler } from '../handlers/Swap.handler'

export function use0xQuote(handler: SwapHandler, inputs: SimulateSwapInputs) {
  // console.log('use0xQuote', inputs)
  return useQuery({
    queryKey: ['0xQuote', inputs],
    queryFn: () => handler.getQuote(inputs),
    enabled: !!inputs.tokenIn && !!inputs.tokenOut && !!inputs.swapAmount,
    refetchInterval: 30000, // Refetch every 30 seconds to keep the quote fresh
    retry: 3, // Retry failed requests 3 times
  } as UseQueryOptions)
}
