'use client'

import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import {
  Card,
  Center,
  HStack,
  VStack,
  Tooltip,
  useDisclosure,
  IconButton,
  Button,
  Box,
  CardHeader,
  CardFooter,
  CardBody,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useSwap } from './SwapProvider'
import { TokenSelectModal } from '../tokens/TokenSelectModal/TokenSelectModal'
import { Address } from 'viem'
import { SwapPreviewModal } from './modal/SwapModal'
import { TransactionSettings } from '../user/settings/TransactionSettings'
import { PriceImpactAccordion } from '../price-impact/PriceImpactAccordion'
import { ChainSelect } from '../chains/ChainSelect'
import { CheckCircle, Link, Repeat } from 'react-feather'
import { SwapRate } from './SwapRate'
import { SwapDetails } from './SwapDetails'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { ErrorAlert } from '@/lib/shared/components/errors/ErrorAlert'
import { useIsMounted } from '@/lib/shared/hooks/useIsMounted'
import { ConnectWallet } from '../web3/ConnectWallet'
import { SafeAppAlert } from '@/lib/shared/components/alerts/SafeAppAlert'
import { useActiveAccount } from 'thirdweb/react'

export function SwapForm() {
  const {
    tokenIn,
    tokenOut,
    selectedChain,
    price,
    tokens,
    quote,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    setSelectedChain,
    setTokenInAmount,
    setTokenOutAmount,
    setTokenIn,
    setTokenOut,
    switchTokens,
    setNeedsToAcceptHighPI,
    resetSwapAmounts,
    fetchPrice,
    fetchQuote,
  } = useSwap()

  const [copiedDeepLink, setCopiedDeepLink] = useState(false)
  const tokenSelectDisclosure = useDisclosure()
  const [tokenSelectKey, setTokenSelectKey] = useState<'tokenIn' | 'tokenOut'>('tokenIn')
  const nextBtn = useRef(null)
  const finalRefTokenIn = useRef(null)
  const finalRefTokenOut = useRef(null)
  const isMounted = useIsMounted()
  const activeAccount = useActiveAccount()

  const isLoading = !price || !quote
  const loadingText = isLoading ? 'Fetching swap...' : undefined

  function copyDeepLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopiedDeepLink(true)
    setTimeout(() => setCopiedDeepLink(false), 2000)
  }

  function handleTokenSelect(token: GqlToken) {
    if (!token) return
    if (tokenSelectKey === 'tokenIn') {
      setTokenIn(token.address as Address)
    } else if (tokenSelectKey === 'tokenOut') {
      setTokenOut(token.address as Address)
    }
  }

  function openTokenSelectModal(key: 'tokenIn' | 'tokenOut') {
    setTokenSelectKey(key)
    tokenSelectDisclosure.onOpen()
  }

  function onModalClose() {
    previewModalDisclosure.onClose()
    resetSwapAmounts()
  }

  return (
    <FadeInOnView>
      <Center
        h="full"
        w={['100vw', 'full']}
        maxW="lg"
        mx="auto"
        position="relative"
        left={['-12px', '0']}
      >
        <Card rounded="xl">
          <CardHeader as={HStack} w="full" justify="space-between" zIndex={11}>
            <span>Swap</span>
            <HStack>
              <Tooltip label={copiedDeepLink ? 'Copied!' : 'Copy swap link'}>
                <Button variant="tertiary" size="sm" color="grayText" onClick={copyDeepLink}>
                  {copiedDeepLink ? <CheckCircle size={16} /> : <Link size={16} />}
                </Button>
              </Tooltip>
              <TransactionSettings size="sm" />
            </HStack>
          </CardHeader>
          <CardBody as={VStack} align="start">
            <VStack spacing="md" w="full">
              <SafeAppAlert />
              <ChainSelect
                value={selectedChain}
                onChange={newValue => {
                  setSelectedChain(newValue as GqlChain)
                  setTokenInAmount('')
                }}
              />
              <VStack w="full">
                <TokenInput
                  ref={finalRefTokenIn}
                  address={tokenIn.address}
                  chain={selectedChain}
                  value={tokenIn.amount}
                  onChange={e => setTokenInAmount(e.currentTarget.value)}
                  toggleTokenSelect={() => openTokenSelectModal('tokenIn')}
                />
                <Box position="relative">
                  <IconButton
                    position="absolute"
                    variant="tertiary"
                    size="sm"
                    fontSize="2xl"
                    ml="-4"
                    mt="-4"
                    w="8"
                    h="8"
                    isRound={true}
                    aria-label="Switch tokens"
                    icon={<Repeat size={16} />}
                    onClick={switchTokens}
                  />
                </Box>
                <TokenInput
                  ref={finalRefTokenOut}
                  address={tokenOut.address}
                  chain={selectedChain}
                  value={tokenOut.amount}
                  onChange={e => setTokenOutAmount(e.currentTarget.value)}
                  toggleTokenSelect={() => openTokenSelectModal('tokenOut')}
                  hasPriceImpact
                  disableBalanceValidation
                  isLoadingPriceImpact={isLoading}
                />
              </VStack>
              {price && quote && (
                <PriceImpactAccordion
                  setNeedsToAcceptPIRisk={setNeedsToAcceptHighPI}
                  accordionButtonComponent={<SwapRate />}
                  accordionPanelComponent={<SwapDetails />}
                  isDisabled={isLoading}
                />
              )}
              {!price && !quote && (
                <ErrorAlert title="Error fetching swap">Unable to fetch price and quote</ErrorAlert>
              )}
            </VStack>
          </CardBody>
          <CardFooter>
            {activeAccount ? (
              <Tooltip label={isDisabled ? disabledReason : ''}>
                <Button
                  ref={nextBtn}
                  variant="secondary"
                  w="full"
                  size="lg"
                  isDisabled={isDisabled || !isMounted}
                  isLoading={isLoading}
                  loadingText={loadingText}
                  onClick={() => !isDisabled && previewModalDisclosure.onOpen()}
                >
                  Next
                </Button>
              </Tooltip>
            ) : (
              <ConnectWallet
                variant="primary"
                w="full"
                size="lg"
                isLoading={isLoading}
                loadingText={loadingText}
              />
            )}
          </CardFooter>
        </Card>
      </Center>
      <TokenSelectModal
        finalFocusRef={tokenSelectKey === 'tokenIn' ? finalRefTokenIn : finalRefTokenOut}
        chain={selectedChain}
        tokens={tokens} // You'll need to provide the list of tokens here
        currentToken={tokenSelectKey === 'tokenIn' ? tokenIn.address : tokenOut.address}
        isOpen={tokenSelectDisclosure.isOpen}
        onOpen={tokenSelectDisclosure.onOpen}
        onClose={tokenSelectDisclosure.onClose}
        onTokenSelect={handleTokenSelect}
      />
      <SwapPreviewModal
        finalFocusRef={nextBtn}
        isOpen={previewModalDisclosure.isOpen}
        onOpen={previewModalDisclosure.onOpen}
        onClose={onModalClose}
      />
    </FadeInOnView>
  )
}
