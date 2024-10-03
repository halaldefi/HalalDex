import { TransactionConfig } from '../../web3/contracts/contract.types'
import {
  BuildSwapInputs,
  SimulateSwapResponse,
  SimulateSwapInputs,
  SimulateSwapResponse0x,
} from '../swap.types'
import { GqlToken } from '@/lib/modules/tokens/SupportedChains'

/**
 * SwapHandler is an interface that defines the methods that must be implemented by a handler.
 * They take standard inputs from the UI and return frontend standardised outputs.
 */
export interface SwapHandler {
  tokens?: GqlToken[]
  name: string

  simulate(inputs: SimulateSwapInputs): Promise<SimulateSwapResponse0x>
  build?(inputs: BuildSwapInputs): TransactionConfig
  getQuote(params: SimulateSwapInputs): Promise<any>
  buildTransaction(quoteResponse: any): TransactionConfig
}
