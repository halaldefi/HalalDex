import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import arbitrum from './arbitrum'
import mainnet from './mainnet'
import polygon from './polygon'
import base from './base'
import sepolia from './sepolia'
import bsc from './bsc'

const networkConfigs = {
  [GqlChain.Arbitrum]: arbitrum,
  [GqlChain.Base]: base,
  [GqlChain.Mainnet]: mainnet,
  [GqlChain.Polygon]: polygon,
  [GqlChain.Sepolia]: sepolia,
}

export default networkConfigs
