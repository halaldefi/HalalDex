/* eslint-disable react-hooks/exhaustive-deps */
import { ManagedSendTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'
import {
  TransactionLabels,
  TransactionStep,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { GqlSorSwapType, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { VStack, Text } from '@chakra-ui/react' // Add Text import
import { capitalize } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTransactionState } from '../transactions/transaction-steps/TransactionStateProvider'
import { BuildSwapQueryParams, useBuildSwapQuery } from './queries/useBuildSwapQuery'
import { swapActionPastTense } from './swap.helpers'
import { SimulateSwapInputs, SwapAction } from './swap.types'
import { useTokenBalances } from '../tokens/TokenBalancesProvider'
import { useUserAccount } from '../web3/UserAccountProvider'
import { useTenderly } from '../web3/useTenderly'
import { getChainId } from '@/lib/config/app.config'
import { use0xQuote } from './queries/use0xQuote'
import { useSimulateSwapQuery } from './queries/useSimulateSwapQuery'

export const swapStepId = 'swap'

export type SwapStepParams = BuildSwapQueryParams & {
  swapAction: SwapAction
  tokenInInfo: GqlToken | undefined
  tokenOutInfo: GqlToken | undefined
}

export function useSwapStep({
  handler,
  swapState,
  swapAction,
  tokenInInfo,
  tokenOutInfo,
}: SwapStepParams): TransactionStep {
  const { getTransaction } = useTransactionState()
  console.log('useSwapStep getTransaction', getTransaction(swapStepId))
  const { refetchBalances } = useTokenBalances()

  const quoteInputs: SimulateSwapInputs = {
    tokenIn: swapState.tokenIn,
    tokenOut: swapState.tokenOut,
    swapAmount:
      swapState.swapType === GqlSorSwapType.ExactIn
        ? swapState.tokenIn.amount
        : swapState.tokenOut.amount,
    chain: swapState.selectedChain,
    swapType: swapState.swapType,
    userAddress: swapState.userAddress,
  }
  console.log('quoteInputs', quoteInputs)

  const {
    data: quoteData,
    isLoading: isQuoteLoading,
    error: quoteError,
  } = use0xQuote(handler, quoteInputs)
  console.log('quoteData', quoteData)
  console.log('quoteError', quoteError)
  console.log('isQuoteLoading', isQuoteLoading)

  const labels: TransactionLabels = {
    init: capitalize(swapAction),
    title: capitalize(swapAction),
    confirming: 'Confirming swap...',
    confirmed: `${swapActionPastTense(swapAction)}!`,
    tooltip: `${capitalize(swapAction)} ${tokenInInfo?.symbol || 'Unknown'} for ${
      tokenOutInfo?.symbol || 'Unknown'
    }`,
    description: `${capitalize(swapAction)} ${tokenInInfo?.symbol || 'Unknown'} for ${
      tokenOutInfo?.symbol || 'Unknown'
    }`,
  }

  const transaction = getTransaction(swapStepId)

  const isComplete = () => transaction?.result.isSuccess || false
  console.log('useSwapStep transaction', transaction)
  console.log('useSwapStep quoteData', quoteData)
  console.log('useSwapStep quoteError', quoteError)
  console.log('useSwapStep isQuoteLoading', isQuoteLoading)
  console.log('useSwapStep isComplete', isComplete())
  return useMemo(
    () => ({
      id: swapStepId,
      stepType: 'swap',
      labels,
      isComplete,
      onSuccess: () => refetchBalances(),
      renderAction: () => (
        <VStack w="full">
          {quoteError ? (
            <Text color="red.500">Error fetching quote: {quoteError.message}</Text>
          ) : (
            <ManagedSendTransactionButton id={swapStepId} labels={labels} quoteData={quoteData} />
          )}
        </VStack>
      ),
    }),
    [quoteData, quoteError, isQuoteLoading, transaction, labels, refetchBalances]
  )
}
