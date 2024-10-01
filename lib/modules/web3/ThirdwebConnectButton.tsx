import { ConnectButton, darkTheme } from 'thirdweb/react'
import { polygon, ethereum, arbitrum, bsc } from 'thirdweb/chains'
import { client } from './ThirdwebConfig'
import { Box, Button } from '@chakra-ui/react'

export function ThirdwebConnectButton() {
  return (
    <Button variant="tertiary">
      <ConnectButton
        client={client}
        theme={darkTheme({
          colors: {
            primaryButtonBg: '#464d58',
            primaryButtonText: '#fff',
            connectedButtonBg: '#464d58',
          },
        })}
        detailsButton={{
          style: {
            height: '100%',
            background: 'transparent',
            alignItems: 'center',
            border: 'none',
            justifyContent: 'flex-start',
          },
        }}
        connectButton={{
          label: 'Connect Wallet',
          style: {
            height: '100%',
            background: 'transparent',
            minWidth: '132px',
          },
        }}
        appMetadata={{
          name: 'Halal IO',
          url: 'https://halal.io',
        }}
        chains={[ethereum, polygon, bsc, arbitrum]}
      />
    </Button>
  )
}
