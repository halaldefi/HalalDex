// src/lib/config/projectConfigBalancer.ts
import { ProjectConfig } from '@/lib/config/config.types'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { isProd } from '@/lib/config/app.config'
import { isSupportedGqlChain } from '@/lib/modules/tokens/SupportedChains'

export const ProjectConfigBalancer: ProjectConfig = {
  projectId: 'balancer',
  projectName: 'Balancer',
  supportedNetworks: (
    [
      GqlChain.Mainnet,
      GqlChain.Arbitrum,
      GqlChain.Avalanche,
      GqlChain.Base,
      GqlChain.Gnosis,
      GqlChain.Polygon,
      GqlChain.Zkevm,
      GqlChain.Optimism,
      GqlChain.Mode,
      GqlChain.Fraxtal,
      // testnets only in dev mode
      ...(isProd ? [] : [GqlChain.Sepolia]),
    ] as GqlChain[]
  ).filter(isSupportedGqlChain), // Filter to include only supported chains
  corePoolId: '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014', // veBAL BAL8020 (Balancer 80 BAL 20 WETH) pool on Ethereum
}
