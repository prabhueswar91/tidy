import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import { defineChain } from '@reown/appkit/networks'

// ✅ Use env or fallback
export const projectId =
  process.env.NEXT_PUBLIC_PROJECT_ID ||
  'fee9f78762f8ba8722f2b77f2fc90f91'

// ✅ Chain from env
export const appChain = defineChain({
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 8453),
  caipNetworkId: `eip155:${process.env.NEXT_PUBLIC_CHAIN_ID || 8453}`,
  chainNamespace: 'eip155',
  name: process.env.NEXT_PUBLIC_CHAIN_NAME || 'Base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_CHAIN_RPC || 'https://mainnet.base.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: process.env.NEXT_PUBLIC_BLOCK_EXPLORER || 'https://basescan.org',
    },
  },
})

export const networks = [appChain]

// ✅ Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: false, // IMPORTANT: we are client only
  projectId,
  networks
})

// ✅ Bitcoin Adapter (optional)
export const bitcoinAdapter = new BitcoinAdapter({
  projectId
})

// ✅ Export config for WagmiProvider
export const config = wagmiAdapter.wagmiConfig
