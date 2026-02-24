'use client'

import React, { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { createAppKit } from '@reown/appkit/react'
import { baseSepolia, bitcoin } from '@reown/appkit/networks'

import {
  wagmiAdapter,
  bitcoinAdapter,
  projectId,
  config
} from '../config/wagmiConfig'

const queryClient = new QueryClient()

// ✅ Initialize AppKit ONLY ONCE
createAppKit({
  adapters: [wagmiAdapter, bitcoinAdapter],
  projectId,
  networks: [baseSepolia, bitcoin],
  defaultNetwork: baseSepolia,
  metadata: {
    name: 'TIDYZEN',
    description: 'TIDYZEN',
    url: 'https://test.bloxio.co/',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  },

  // 🔥 Show MetaMask first
  featuredWalletIds: ['metamask'],
allWallets: 'HIDE',

  // 🔥 IMPORTANT
  enableInjected: true,
  features: {
    analytics: true
  }
})

function ContextProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider