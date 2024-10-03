import { getChainId } from '@/lib/config/app.config'
import { GqlChain } from '@/lib/modules/tokens/SupportedChains'

export function isMainnet(chain: GqlChain | number): boolean {
  return chain === GqlChain.Mainnet || chain === getChainId(GqlChain.Mainnet)
}

export function isNotMainnet(chain: GqlChain | number): boolean {
  return !isMainnet(chain)
}
