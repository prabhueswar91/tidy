"use client"

import UniversalProvider from "@walletconnect/universal-provider"
import { WalletConnectModal } from "@walletconnect/modal"

let provider: UniversalProvider | null = null
let modal: WalletConnectModal | null = null

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
//const CHAIN_ID = process.env.CHAIN_ID!;
const CHAIN_ID = 84532;

export async function initWalletConnect(): Promise<UniversalProvider> {
  if (provider) return provider

  provider = await UniversalProvider.init({
    projectId,
    metadata: {
      name: "TIDYZEN",
      description: "TIDYZEN",
      url: window?.location?.origin,
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
  })

  modal = new WalletConnectModal({
    projectId,
    themeMode: "dark",
  })

  provider.on("display_uri", (uri: string) => {
    modal?.openModal({ uri })
  })

  provider.on("connect", () => {
    modal?.closeModal()
  })

  return provider
}

export async function mobileConect(wcProvider: UniversalProvider): Promise<string> {
  alert(CHAIN_ID)
  const session = await wcProvider.connect({
    optionalNamespaces: {
      eip155: {
        methods: [
          "eth_sendTransaction",
          "eth_signTransaction",
          "eth_sign",
          "personal_sign",
          "eth_signTypedData",
        ],
        chains: [`eip155:${CHAIN_ID}`],
        events: ["chainChanged", "accountsChanged"],
      },
    },
  })

  const accounts = session?.namespaces.eip155.accounts
  let address = ""
  if (accounts && accounts[0]) {
    address = accounts[0].split(":")[2]
  }

  return address
}

export async function disconnectWallet(): Promise<void> {
  if (!provider) return
  await provider.disconnect()
  provider = null
}