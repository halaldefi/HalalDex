/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect } from 'react'
import {
  ManagedErc20TransactionInput,
  useManagedErc20Transaction,
} from '../../web3/contracts/useManagedErc20Transaction'
import {
  ManagedSendTransactionInput,
  useManagedSendTransaction,
} from '../../web3/contracts/useManagedSendTransaction'
import {
  ManagedTransactionInput,
  useManagedTransaction,
} from '../../web3/contracts/useManagedTransaction'
import { TransactionStepButton } from './TransactionStepButton'
import { useTransactionState } from './TransactionStateProvider'

export function ManagedTransactionButton({
  id,
  ...params
}: { id: string } & ManagedTransactionInput) {
  const transaction = useManagedTransaction(params)
  const { updateTransaction } = useTransactionState()

  useEffect(() => {
    updateTransaction(id, transaction)
  }, [id, transaction.execution.status, transaction.simulation.status, transaction.result.status])
  return <TransactionStepButton step={{ labels: params.labels, ...transaction }} />
}
// const { gas } = quoteResponse; // This is from your 0x API response

export function ManagedSendTransactionButton({
  id,
  ...params
}: { id: string } & ManagedSendTransactionInput) {
  console.log('ManagedSendTransactionButton', params)
  console.log('ManagedSendTransactionButton', id)
  // Ensure that gas is provided in txConfig
  const txConfigWithGas = {
    ...params.txConfig,
    gas: BigInt(5000000),
  }
  const transaction = useManagedSendTransaction({
    ...params,
    txConfig: txConfigWithGas,
  })
  console.log('ManagedSendTransactionButton', transaction)
  const { updateTransaction } = useTransactionState()

  useEffect(() => {
    updateTransaction(id, transaction)
  }, [id, transaction.execution.status, transaction.simulation.status, transaction.result.status])
  if (!txConfigWithGas.gas) {
    console.warn('Gas not provided in txConfig. This may lead to inaccurate gas estimation.')
  }

  return <TransactionStepButton step={{ labels: params.labels, ...transaction }} />
}

export function ManagedErc20TransactionButton({
  id,
  ...params
}: { id: string } & ManagedErc20TransactionInput) {
  const transaction = useManagedErc20Transaction(params)
  const { updateTransaction } = useTransactionState()

  useEffect(() => {
    updateTransaction(id, transaction)
  }, [id, transaction.execution.status, transaction.simulation.status, transaction.result.status])

  return <TransactionStepButton step={{ labels: params.labels, ...transaction }} />
}
