import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base } from '@reown/appkit/networks'


export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!

export const networks = [base]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId:"b01f86bb575d8820ed3e4337491b9685",
  networks
})

export const config = wagmiAdapter.wagmiConfig