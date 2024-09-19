'use client'

import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalProps } from '@chakra-ui/react'
import { RefObject, useEffect, useRef } from 'react'
import { DesktopStepTracker } from '../../transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { useSwap } from '../SwapProvider'
import { SwapTimeout } from './SwapTimeout'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { capitalize } from 'lodash'
import { ActionModalFooter } from '../../../shared/components/modals/ActionModalFooter'
import { TransactionModalHeader } from '../../../shared/components/modals/TransactionModalHeader'
import { chainToSlugMap } from '../../pool/pool.utils'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '../../transactions/transaction-steps/step-tracker/step-tracker.utils'
import { SuccessOverlay } from '@/lib/shared/components/modals/SuccessOverlay'
import { useResetStepIndexOnOpen } from '../../pool/actions/useResetStepIndexOnOpen'
import { useOnUserAccountChanged } from '../../web3/useOnUserAccountChanged'
import { SwapSummary } from './SwapSummary'
import { useSwapReceipt } from '../../transactions/transaction-steps/receipts/receipt.hooks'
import { useUserAccount } from '../../web3/UserAccountProvider'
import { GqlChain, GqlSorSwapType } from '@/lib/shared/services/api/generated/graphql'
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
}

export function SwapPreviewModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const { isDesktop } = useBreakpoints()
  const initialFocusRef = useRef(null)
  const activeAccount = useActiveAccount()
  const activeChain = useActiveWalletChain()

  const {
    price,
    quote,
    tokenIn,
    tokenOut,
    swapType,
    selectedChain,
    isDisabled,
    disabledReason,
    fetchQuote,
  } = useSwap()

  useEffect(() => {
    if (isOpen && !quote && !isDisabled) {
      fetchQuote()
    }
  }, [isOpen, quote, isDisabled, fetchQuote])
  const swapReceipt = useSwapReceipt({
    txHash: '0xf27d44e057cbc0feb41965a45a835823e3ab02df21585fdd8b85bcdb30895394',
    userAddress: '0x239084A4A0C0610F6355dFA251055486157eFB2c',
    chain: GqlChain.Mainnet,
  })
  const swapAction = swapType === GqlSorSwapType.ExactIn ? 'Swap' : 'Receive'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isCentered
      preserveScrollBarGap
      {...rest}
    >
      <SuccessOverlay startAnimation={!!quote} />

      <ModalContent>
        <TransactionModalHeader
          label={`Review ${capitalize(swapAction)}`}
          timeout={<SwapTimeout />}
          txHash={quote?.transaction?.hash}
          chain={selectedChain}
          isReceiptLoading={false}
        />
        <ModalCloseButton />
        <ModalBody>
          <SwapSummary {...swapReceipt} />
        </ModalBody>
        {/*  <ActionModalFooter
          isSuccess={!!quote}
          currentStep={quote ? 1 : 0}
          returnLabel="Swap again"
          returnAction={onClose}
        /> */}
      </ModalContent>
    </Modal>
  )
}
