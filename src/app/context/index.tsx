'use client'

import { wagmiAdapter, projectId,networks } from '../config/wagmiConfig'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { base } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defineddddd')
}

const metadata = {
  name: 'TIDYCOIN',
  description: 'TIDYCOIN',
  url: 'https://tidy-mocha.vercel.app/',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}
console.log(projectId,'projectIdprojectIdprojectId')
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [networks[0]],
  defaultNetwork: base,
  metadata: metadata,
  features: {
    analytics: true
  },
  enableCoinbase: true,
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