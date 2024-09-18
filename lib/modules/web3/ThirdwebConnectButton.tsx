import { ConnectButton } from 'thirdweb/react'
import { polygon, ethereum, arbitrum, bsc } from 'thirdweb/chains'
import { client } from './ThirdwebConfig'

export function ThirdwebConnectButton() {
  return (
    <ConnectButton
      client={client}
      appMetadata={{
        name: 'Halal IO',
        url: 'https://halal.io',
      }}
      chains={[ethereum, polygon, bsc, arbitrum]}
    />
  )
}
