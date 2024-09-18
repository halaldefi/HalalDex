'use client'

import { createThirdwebClient } from 'thirdweb'
import { createWallet, inAppWallet } from 'thirdweb/wallets'

const thirdwebClient = createThirdwebClient({
  secretKey:
    'xXtC_IK0yrz-wrPC9pDu9TtF0MAyG6OXixHXBNccACglHjxO8cUDjCPzVbkmI_Zk1BqMp4vgOCl2bIxfDwCWxA',
})
if (!thirdwebClient) {
  throw new Error('No client ID provided')
}

export const client = thirdwebClient

const thirdwebWallet = [
  createWallet('io.metamask'),
  inAppWallet({
    auth: {
      options: ['email', 'google', 'apple', 'facebook', 'phone'],
    },
  }),
]

export const thirdwebWallets = thirdwebWallet
