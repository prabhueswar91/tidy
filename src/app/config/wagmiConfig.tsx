import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import { baseSepolia } from '@reown/appkit/networks'


export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID! || "b01f86bb575d8820ed3e4337491b9685"

export const networks = [baseSepolia]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId:"b01f86bb575d8820ed3e4337491b9685",
  networks
})

export const bitcoinAdapter = new BitcoinAdapter({
  projectId: "b01f86bb575d8820ed3e4337491b9685"
})

export const config = wagmiAdapter.wagmiConfig