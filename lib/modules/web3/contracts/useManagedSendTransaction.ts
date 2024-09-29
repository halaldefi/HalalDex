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
import { SendTransactionParameters } from 'wagmi/actions'
import { useSignTypedData } from 'wagmi'
import { numberToHex, concat, hexToBytes } from 'viem/utils'

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
  const { signTypedDataAsync } = useSignTypedData()
  console.log('useManagedSendTransaction:signTypedDataAsync', signTypedDataAsync)
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
      // Check if Permit2 EIP-712 data is available
      if (quoteData.permit2?.eip712) {
        let signature: `0x${string}` | undefined
        try {
          // Sign the EIP-712 Permit2 message
          signature = await signTypedDataAsync({
            domain: quoteData.permit2.eip712.domain,
            types: quoteData.permit2.eip712.types,
            primaryType: quoteData.permit2.eip712.primaryType,
            message: quoteData.permit2.eip712.message,
          })
          console.log('Signed Permit2 message from quoteData')
        } catch (error) {
          console.error('Error signing Permit2 message:', error)
          throw error
        }

        // Append signature length and signature data to txConfig.data
        if (signature && txConfig.data) {
          const signatureBytes = hexToBytes(signature)
          const signatureLengthInHex = numberToHex(signatureBytes.length, {
            signed: false,
            size: 32,
          })

          const transactionData = txConfig.data as `0x${string}`
          const sigLengthHex = signatureLengthInHex as `0x${string}`
          const sig = signature as `0x${string}`

          txConfig.data = concat([transactionData, sigLengthHex, sig])
        } else {
          throw new Error('Failed to obtain signature or transaction data')
        }
      }

      // Proceed to send the transaction
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
