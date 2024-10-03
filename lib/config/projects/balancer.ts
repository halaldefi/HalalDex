import { ProjectConfig } from '@/lib/config/config.types'
import { GqlChain } from '@/lib/modules/tokens/SupportedChains'
import { isProd } from '@/lib/config/app.config'

export const ProjectConfigBalancer: ProjectConfig = {
  projectId: 'balancer',
  projectName: 'Balancer',
  supportedNetworks: [
    GqlChain.Mainnet,
    GqlChain.Arbitrum,
    GqlChain.Base,
    GqlChain.Polygon,

    // testnets only in dev mode
    ...(isProd ? [] : [GqlChain.Sepolia]),
  ],
  corePoolId: '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014', // veBAL BAL8020 (Balancer 80 BAL 20 WETH) pool on Ethereum
}
