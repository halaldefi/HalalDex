/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { ManagedResult, TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { useEffect } from 'react'
import { useEstimateGas, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { TransactionConfig, TransactionExecution, TransactionSimulation } from './contract.types'
import { useOnTransactionConfirmation } from './useOnTransactionConfirmation'
import { useOnTransactionSubmission } from './useOnTransactionSubmission'
import { getGqlChain } from '@/lib/config/app.config'
import { useChainSwitch } from '../useChainSwitch'
import {
  captureWagmiExecutionError,
  sentryMetaForWagmiExecution,
} from '@/lib/shared/utils/query-errors'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { useRecentTransactions } from '../../transactions/RecentTransactionsProvider'
import { mainnet } from 'viem/chains'
import { useTxHash } from '../safe.hooks'
import { getWaitForReceiptTimeout } from './wagmi-helpers'
import { onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { SendTransactionParameters } from 'wagmi'

export type ManagedSendTransactionInput = {
  labels: TransactionLabels
  quoteData: any
  gasEstimationMeta?: Record<string, unknown>
}

export function useManagedSendTransaction({
  labels,
  quoteData,
  gasEstimationMeta,
}: ManagedSendTransactionInput) {
  const chainId = quoteData.permit2.eip712.domain.chainId || mainnet.id
  console.log('useManagedSendTransaction:quoteData', quoteData)
  console.log('useManagedSendTransaction:chainId', chainId)
  const { shouldChangeNetwork } = useChainSwitch(chainId)
  const { minConfirmations } = useNetworkConfig()
  const { updateTrackedTransaction } = useRecentTransactions()
  console.log('useManagedSendTransaction:shouldChangeNetwork', shouldChangeNetwork)

  const txConfig: TransactionConfig = {
    chainId,
    to: quoteData.transaction.to,
    data: quoteData.transaction.data,
    value: quoteData.transaction.value,
    gas: BigInt(quoteData.transaction.gas),
    account: quoteData.transaction.account,
  }

  const writeMutation = useSendTransaction({
    mutation: {
      meta: sentryMetaForWagmiExecution('Error sending transaction', {
        quoteData,
        estimatedGas: quoteData.transaction.gas,
        tenderlyUrl: gasEstimationMeta?.tenderlyUrl,
      }),
    },
  })

  const { txHash, isSafeTxLoading } = useTxHash({ chainId, wagmiTxHash: writeMutation.data })
  const transactionStatusQuery = useWaitForTransactionReceipt({
    chainId,
    hash: txHash,
    confirmations: minConfirmations,
    timeout: getWaitForReceiptTimeout(chainId),
  })

  const bundle = {
    chainId,
    simulation: {
      data: quoteData.transaction.gas,
      isLoading: false,
      isError: false,
    } as TransactionSimulation,
    execution: writeMutation as TransactionExecution,
    result: transactionStatusQuery,
    isSafeTxLoading,
  }

  // when the transaction is successfully submitted to the chain
  // start monitoring the hash
  //
  // when the transaction has an execution error, update that within
  // the global transaction cache too
  useEffect(() => {
    if (bundle?.execution?.data) {
      // add transaction here
    }
  }, [bundle.execution?.data])

  // when the transaction has an execution error, update that within
  // the global transaction cache
  // this can either be an execution error or a confirmation error
  useEffect(() => {
    if (bundle?.execution?.error) {
      // monitor execution error here
    }
    if (bundle?.result?.error) {
      // monitor confirmation error here
    }
  }, [bundle.execution?.error, bundle.result?.error])

  useEffect(() => {
    if (transactionStatusQuery.error) {
      if (txHash) {
        updateTrackedTransaction(txHash, {
          status: 'timeout',
          label: 'Transaction timeout',
          duration: null,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionStatusQuery.error])

  // on successful submission to chain, add tx to cache
  useOnTransactionSubmission({
    labels,
    hash: txHash,
    chain: getGqlChain(chainId),
  })

  // on confirmation, update tx in tx cache
  useOnTransactionConfirmation({
    labels,
    status: bundle.result.data?.status,
    hash: bundle.result.data?.transactionHash,
  })

  const managedSendAsync = async () => {
    if (!txConfig.to || !txConfig.gas) return
    try {
      const sendTransactionParams: SendTransactionParameters = {
        chainId,
        to: txConfig.to as `0x${string}`,
        data: txConfig.data as `0x${string}`,
        value: txConfig.value,
        gas: txConfig.gas,
        account: txConfig.account as `0x${string}`,
      }
      return writeMutation.sendTransactionAsync(sendTransactionParams)
    } catch (e: unknown) {
      captureWagmiExecutionError(e, 'Error in send transaction execution', {
        chainId,
        quoteData,
        gas: txConfig.gas,
      })
      throw e
    }
  }

  return {
    ...bundle,
    executeAsync: managedSendAsync,
  } satisfies ManagedResult
}
