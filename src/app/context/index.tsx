'use client'

import { wagmiAdapter, projectId,networks } from '../config/wagmiConfig'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { base,solana } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

const metadata = {
  name: 'TIDYZEN',
  description: 'TIDYZEN',
  url: 'https://test.bloxio.co/',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}
console.log(projectId,'projectIdprojectIdprojectId')
createAppKit({
  adapters: [wagmiAdapter,new SolanaAdapter()],
  projectId,
  networks: [networks[0],solana],
  defaultNetwork: base,
  metadata: metadata,
  features: {
    analytics: true
  },
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider