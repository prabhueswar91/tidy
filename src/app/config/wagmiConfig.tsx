import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import { baseSepolia } from '@reown/appkit/networks'

// ✅ Use env or fallback
export const projectId =
  process.env.NEXT_PUBLIC_PROJECT_ID ||
  'fee9f78762f8ba8722f2b77f2fc90f91'

export const networks = [baseSepolia]

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