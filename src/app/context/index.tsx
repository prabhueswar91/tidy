'use client'

import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { createAppKit } from '@reown/appkit/react'
import { bitcoin } from '@reown/appkit/networks'
import {
  wagmiAdapter,
  bitcoinAdapter,
  projectId,
  appChain,
  config
} from '../config/wagmiConfig'

const queryClient = new QueryClient()

createAppKit({
  adapters: [wagmiAdapter, bitcoinAdapter],
  projectId,
  networks: [appChain, bitcoin],
  defaultNetwork: appChain,
  metadata: {
    name: 'TIDYZEN',
    description: 'TIDYZEN',
    url: typeof window !== "undefined" ? window.location.origin : "",
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  },
  featuredWalletIds: ['metamask'],
  allowUnsupportedChain: true
})

export default function ContextProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
