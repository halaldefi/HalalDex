import { useUserSettings } from '@/lib/modules/user/settings/UserSettingsProvider'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useQuery } from '@tanstack/react-query'
import { ensureLastQueryResponse } from '../../pool/actions/LiquidityActionHelpers'
import { SwapHandler } from '../handlers/Swap.handler'
import { SimulateSwapResponse, SimulateSwapResponse0x, SwapState } from '../swap.types'
import { swapQueryKeys } from './swapQueryKeys'
import { SwapSimulationQueryResult } from './useSimulateSwapQuery'
import { useRelayerSignature } from '../../relayer/RelayerSignatureProvider'
import { SwapMetaParams, sentryMetaForSwapHandler } from '@/lib/shared/utils/query-errors'
import { getChainId } from '@/lib/config/app.config'
import { useBlockNumber } from 'wagmi'
import { GqlSorSwapType } from '@/lib/shared/services/api/generated/graphql'

export type BuildSwapQueryResponse = ReturnType<typeof useBuildSwapQuery>

export type BuildSwapQueryParams = {
  handler: SwapHandler
  simulationQuery: SwapSimulationQueryResult
  wethIsEth: boolean
  swapState: SwapState
}

// Uses the SDK to build a transaction config to be used by wagmi's useManagedSendTransaction
export function useBuildSwapQuery({
  handler,
  simulationQuery,
  wethIsEth,
  swapState,
  enabled,
}: BuildSwapQueryParams & {
  enabled: boolean
}) {
  const { userAddress, isConnected } = useUserAccount()
  console.log('userAddress:', userAddress)
  const { slippage } = useUserSettings()
  const { selectedChain, tokenIn, tokenOut, swapType } = swapState
  const chainId = getChainId(selectedChain)
  const { data: blockNumber } = useBlockNumber({ chainId })

  const queryKey = swapQueryKeys.build({
    selectedChain,
    account: userAddress,
    slippagePercent: slippage,
    simulateResponse:
      simulationQuery.data ||
      ({
        effectivePrice: '0',
        effectivePriceReversed: '0',
        returnAmount: '0',
        swapType: swapState.swapType,
      } as SimulateSwapResponse0x),
  })

  const queryFn = async () => {
    console.log('Building swap query...')
    if (!simulationQuery.data) {
      console.log('Simulation data is not available')
      throw new Error('Simulation data is not available')
    }

    console.log('Getting quote...')
    // only go ahead if userAddress is set
    if (!userAddress) {
      console.log('User address is not available')
      throw new Error('User address is not available')
    }
    console.log('User address is available:', userAddress)
    const quoteResponse = await handler.getQuote({
      tokenIn,
      tokenOut,
      swapAmount: swapType === GqlSorSwapType.ExactIn ? tokenIn.amount : tokenOut.amount,
      swapType,
      userAddress,
      chain: selectedChain,
    })
    console.log('Quote response:', quoteResponse)

    console.log('Building transaction...')
    const transactionConfig = handler.buildTransaction(quoteResponse)
    console.log('Transaction config:', transactionConfig)

    return transactionConfig
  }

  return useQuery({
    queryKey,
    queryFn,
    enabled: enabled && isConnected && !!simulationQuery.data,
    gcTime: 0,
    meta: sentryMetaForSwapHandler('Error in swap buildCallData query', {
      chainId,
      blockNumber,
      handler,
      swapState,
      slippage,
      wethIsEth,
    } as SwapMetaParams),
    ...onlyExplicitRefetch,
  })
}
