'use client'
/* eslint-disable react-hooks/exhaustive-deps */

import { getNetworkConfig } from '@/lib/config/app.config'
import { GqlChain, GqlSorSwapType, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { ApolloClient, useApolloClient, useReactiveVar } from '@apollo/client'
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Address, formatUnits, Hash, isAddress, parseUnits } from 'viem'
import { emptyAddress } from '../web3/contracts/wagmi-helpers'
import { useUserAccount } from '../web3/UserAccountProvider'
import { LABELS } from '@/lib/shared/labels'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { DefaultSwapHandler } from './handlers/DefaultSwap.handler'
import { bn } from '@/lib/shared/utils/numbers'
import { useSimulateSwapQuery } from './queries/useSimulateSwapQuery'
import { useTokens } from '../tokens/TokensProvider'
import { useDisclosure } from '@chakra-ui/react'
import { useSwapSteps } from './useSwapSteps'
import {
  OSwapAction,
  SdkSimulateSwapResponse,
  SimulateSwapResponse,
  SwapAction,
  SwapState,
} from './swap.types'
import { SwapHandler } from './handlers/Swap.handler'
import { isSameAddress, selectByAddress } from '@/lib/shared/utils/addresses'
import { useVault } from '@/lib/shared/hooks/useVault'
import { NativeWrapHandler } from './handlers/NativeWrap.handler'
import {
  getWrapHandlerClass,
  getWrapType,
  getWrapperForBaseToken,
  isNativeWrap,
  isSupportedWrap,
  isWrapOrUnwrap,
} from './wrap.helpers'
import { useTokenInputsValidation } from '../tokens/TokenInputsValidationProvider'
import { useMakeVarPersisted } from '@/lib/shared/hooks/useMakeVarPersisted'
import { HumanAmount } from '@balancer/sdk'
import { ChainSlug, chainToSlugMap, slugToChainMap } from '../pool/pool.utils'
import { invert } from 'lodash'
import { useTransactionSteps } from '../transactions/transaction-steps/useTransactionSteps'
import { useTokenBalances } from '../tokens/TokenBalancesProvider'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { usePriceImpact } from '../price-impact/PriceImpactProvider'
import { calcMarketPriceImpact } from '../price-impact/price-impact.utils'
import { isAuraBalSwap } from './swap.helpers'
import { AuraBalSwapHandler } from './handlers/AuraBalSwap.handler'
import {
  AFFILIATE_FEE,
  BNB_TOKENS_BY_SYMBOL,
  FEE_RECIPIENT,
  MAINNET_TOKENS_BY_SYMBOL,
  NATIVE_TOKEN_ADDRESS,
  POLYGON_TOKENS_BY_SYMBOL,
} from './constant'
import { useActiveAccount, useActiveWallet, useActiveWalletChain } from 'thirdweb/react'
import { toTokens } from 'thirdweb'
import qs from 'qs'

export type UseSwapResponse = ReturnType<typeof _useSwap>
export const SwapContext = createContext<UseSwapResponse | null>(null)

export type PathParams = {
  chain?: string
  tokenIn?: string
  tokenOut?: string
  amountIn?: string
  amountOut?: string
  urlTxHash?: Hash
}
function selectSwapHandler(
  tokenInAddress: Address,
  tokenOutAddress: Address,
  chain: GqlChain,
  swapType: GqlSorSwapType,
  apolloClient: ApolloClient<object>,
  tokens: GqlToken[]
): SwapHandler {
  if (isNativeWrap(tokenInAddress, tokenOutAddress, chain)) {
    return new NativeWrapHandler(apolloClient)
  } else if (isSupportedWrap(tokenInAddress, tokenOutAddress, chain)) {
    const WrapHandler = getWrapHandlerClass(tokenInAddress, tokenOutAddress, chain)
    return new WrapHandler()
  } else if (isAuraBalSwap(tokenInAddress, tokenOutAddress, chain, swapType)) {
    return new AuraBalSwapHandler(tokens)
  }

  return new DefaultSwapHandler(apolloClient)
}

export function _useSwap({ urlTxHash, ...pathParams }: PathParams) {
  const swapStateVar = useMakeVarPersisted<SwapState>(
    {
      tokenIn: {
        address: emptyAddress,
        amount: '',
        scaledAmount: BigInt(0),
      },
      tokenOut: {
        address: emptyAddress,
        amount: '',
        scaledAmount: BigInt(0),
      },
      swapType: GqlSorSwapType.ExactIn,
      selectedChain: GqlChain.Mainnet,
    },
    'swapState'
  )

  const swapState = useReactiveVar(swapStateVar)
  const [needsToAcceptHighPI, setNeedsToAcceptHighPI] = useState(false)
  const [tokenSelectKey, setTokenSelectKey] = useState<'tokenIn' | 'tokenOut'>('tokenIn')
  const [initUserChain, setInitUserChain] = useState<GqlChain | undefined>(undefined)
  const [price, setPrice] = useState<any>(null)
  const [quote, setQuote] = useState<any>(null)

  const activeWallet = useActiveWallet()
  const activeChain = useActiveWalletChain()
  const activeAccount = useActiveAccount()

  const { getToken, getTokensByChain, usdValueForToken, priceFor } = useTokens()
  const { tokens, setTokens } = useTokenBalances()
  const { hasValidationErrors } = useTokenInputsValidation()
  const { setPriceImpact, setPriceImpactLevel } = usePriceImpact()

  const networkConfig = getNetworkConfig(swapState.selectedChain)
  const previewModalDisclosure = useDisclosure()

  async function fetchPrice() {
    const params = {
      chainId: activeChain?.id,
      sellToken: swapState.tokenIn.address,
      buyToken: swapState.tokenOut.address,
      [swapState.swapType === GqlSorSwapType.ExactIn ? 'sellAmount' : 'buyAmount']:
        swapState.swapType === GqlSorSwapType.ExactIn
          ? swapState.tokenIn.scaledAmount.toString()
          : swapState.tokenOut.scaledAmount.toString(),
      taker: activeAccount,
      swapFeeRecipient: FEE_RECIPIENT,
      swapFeeBps: AFFILIATE_FEE,
      swapFeeToken: swapState.tokenOut.address,
      tradeSurplusRecipient: FEE_RECIPIENT,
    }

    try {
      const response = await fetch(`/api/price?${qs.stringify(params)}`)
      const data = await response.json()
      setPrice(data)
      handlePriceResponse(data)
    } catch (error) {
      console.error('Error fetching price:', error)
    }
  }
  const client = useApolloClient()

  const handler = useMemo(
    () =>
      selectSwapHandler(
        swapState.tokenIn.address,
        swapState.tokenOut.address,
        swapState.selectedChain,
        swapState.swapType,
        client,
        tokens
      ),
    [swapState.tokenIn.address, swapState.tokenOut.address, swapState.selectedChain]
  )
  const getSwapAmount = (state: SwapState) =>
    (state.swapType === GqlSorSwapType.ExactIn ? state.tokenIn.amount : state.tokenOut.amount) ||
    '0'
  const shouldFetchSwap = (state: SwapState, urlTxHash?: Hash) => {
    if (urlTxHash) return false
    return (
      isAddress(state.tokenIn.address) &&
      isAddress(state.tokenOut.address) &&
      !!state.swapType &&
      bn(getSwapAmount(swapState)).gt(0)
    )
  }

  const simulationQuery = useSimulateSwapQuery({
    handler,
    swapInputs: {
      chain: swapState.selectedChain,
      tokenIn: swapState.tokenIn.address,
      tokenOut: swapState.tokenOut.address,
      swapType: swapState.swapType,
      swapAmount: getSwapAmount(swapState),
    },
    enabled: shouldFetchSwap(swapState, urlTxHash),
  })
  function handlePriceResponse(data: any) {
    if (data.buyAmount) {
      const tokenOut = getToken(swapState.tokenOut.address, swapState.selectedChain)
      if (tokenOut) {
        swapStateVar({
          ...swapState,
          tokenOut: {
            ...swapState.tokenOut,
            amount: formatUnits(BigInt(data.buyAmount), tokenOut.decimals),
            scaledAmount: BigInt(data.buyAmount),
          },
        })
      }
    }
  }

  async function fetchQuote() {
    const params = {
      chainId: activeChain?.id,
      sellToken: swapState.tokenIn.address,
      buyToken: swapState.tokenOut.address,
      [swapState.swapType === GqlSorSwapType.ExactIn ? 'sellAmount' : 'buyAmount']:
        swapState.swapType === GqlSorSwapType.ExactIn
          ? swapState.tokenIn.scaledAmount.toString()
          : swapState.tokenOut.scaledAmount.toString(),
      taker: activeAccount,
      swapFeeRecipient: FEE_RECIPIENT,
      swapFeeBps: AFFILIATE_FEE,
      swapFeeToken: swapState.tokenOut.address,
      tradeSurplusRecipient: FEE_RECIPIENT,
    }

    try {
      const response = await fetch(`/api/quote?${qs.stringify(params)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setQuote(data)
    } catch (error) {
      console.error('Error fetching quote:', error)
      // You might want to set an error state here
    }
  }
  useEffect(() => {
    console.log('Price changed:', price)
    console.log('Active account:', activeAccount)
    if (price && activeAccount) {
      console.log('Fetching quote...')
      fetchQuote()
    }
  }, [price, activeAccount])

  function setSelectedChain(_selectedChain: GqlChain) {
    swapStateVar({
      ...swapState,
      selectedChain: _selectedChain,
    })
    setTokens(getTokensByChain(_selectedChain))
  }

  function setTokenIn(tokenAddress: Address) {
    swapStateVar({
      ...swapState,
      tokenIn: {
        ...swapState.tokenIn,
        address: tokenAddress,
      },
    })
  }

  function setTokenOut(tokenAddress: Address) {
    swapStateVar({
      ...swapState,
      tokenOut: {
        ...swapState.tokenOut,
        address: tokenAddress,
      },
    })
  }

  function setTokenInAmount(amount: string) {
    const tokenIn = getToken(swapState.tokenIn.address, swapState.selectedChain)
    if (tokenIn) {
      swapStateVar({
        ...swapState,
        tokenIn: {
          ...swapState.tokenIn,
          amount,
          scaledAmount: parseUnits(amount, tokenIn.decimals),
        },
        swapType: GqlSorSwapType.ExactIn,
      })
    }
  }

  function setTokenOutAmount(amount: string) {
    const tokenOut = getToken(swapState.tokenOut.address, swapState.selectedChain)
    if (tokenOut) {
      swapStateVar({
        ...swapState,
        tokenOut: {
          ...swapState.tokenOut,
          amount,
          scaledAmount: parseUnits(amount, tokenOut.decimals),
        },
        swapType: GqlSorSwapType.ExactOut,
      })
    }
  }

  function switchTokens() {
    swapStateVar({
      ...swapState,
      tokenIn: swapState.tokenOut,
      tokenOut: swapState.tokenIn,
      swapType: GqlSorSwapType.ExactIn,
    })
  }

  function resetSwapAmounts() {
    swapStateVar({
      ...swapState,
      tokenIn: {
        ...swapState.tokenIn,
        amount: '',
        scaledAmount: BigInt(0),
      },
      tokenOut: {
        ...swapState.tokenOut,
        amount: '',
        scaledAmount: BigInt(0),
      },
    })
  }

  useEffect(() => {
    if (activeAccount && swapState.tokenIn.amount && swapState.tokenOut.address) {
      fetchPrice()
    }
  }, [activeAccount, swapState.tokenIn.amount, swapState.tokenOut.address, activeChain])

  useEffect(() => {
    if (price && activeAccount) {
      fetchQuote()
    }
  }, [price, activeAccount])

  useEffect(() => {
    if (activeChain) {
      setSelectedChain(activeChain.id as unknown as GqlChain)
    }
  }, [activeChain])

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!activeAccount, LABELS.walletNotConnected],
    [!swapState.tokenOut.amount, 'Invalid amount out'],
    [needsToAcceptHighPI, 'Accept high price impact first'],
    [hasValidationErrors, 'Invalid input'],
    [!quote, 'Error fetching swap'],
    [!price, 'Fetching swap...']
  )

  return {
    ...swapState,
    price,
    tokens,
    quote,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    setSelectedChain,
    setNeedsToAcceptHighPI,
    setTokenIn,
    setTokenOut,
    setTokenInAmount,
    setTokenOutAmount,
    switchTokens,
    resetSwapAmounts,
    fetchPrice,
    fetchQuote,
  }
}

export function SwapProvider({ children }: { children: React.ReactNode }) {
  const swapState = _useSwap({})
  return <SwapContext.Provider value={swapState}>{children}</SwapContext.Provider>
}

export const useSwap = (): {
  price: any
  tokens: any
  quote: any
  isDisabled: boolean
  disabledReason: string | undefined
  previewModalDisclosure: ReturnType<typeof useDisclosure>
  setSelectedChain: (_selectedChain: GqlChain) => void
  setNeedsToAcceptHighPI: React.Dispatch<React.SetStateAction<boolean>>
  setTokenIn: (tokenAddress: Address) => void
  setTokenOut: (tokenAddress: Address) => void
  setTokenInAmount: (amount: string) => void
  setTokenOutAmount: (amount: string) => void
  switchTokens: () => void
  resetSwapAmounts: () => void
  fetchPrice: () => Promise<void>
  fetchQuote: () => Promise<void>
  tokenIn: {
    address: Address
    amount: string
    scaledAmount: bigint
  }
  tokenOut: {
    address: Address
    amount: string
    scaledAmount: bigint
  }
  swapType: GqlSorSwapType
  selectedChain: GqlChain
} => {
  const context = useContext(SwapContext)
  if (!context) {
    throw new Error('useSwap must be used within a SwapProvider')
  }
  return context
}
