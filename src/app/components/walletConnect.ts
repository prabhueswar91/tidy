"use client"

import UniversalProvider from "@walletconnect/universal-provider"
import { WalletConnectModal } from "@walletconnect/modal"

let provider: UniversalProvider | null = null
let modal: WalletConnectModal | null = null

const projectId = "YOUR_PROJECT_ID"

export async function initWalletConnect() {

  provider = await UniversalProvider.init({
    projectId,
    metadata: {
      name: "My Website",
      description: "WalletConnect Example",
      url: window.location.origin,
      icons: ["https://avatars.githubusercontent.com/u/37784886"]
    }
  })

  modal = new WalletConnectModal({
    projectId,
    themeMode: "dark"
  })

  // Listen for URI and open modal
  provider.on("display_uri", (uri: string) => {
    modal?.openModal({ uri })
  })

  // Close modal when connected
  provider.on("connect", () => {
    modal?.closeModal()
  })
}

export async function connectWallet1(): Promise<string> {

  if (!provider) throw new Error("Provider not initialized")

  const session = await provider.connect({

    optionalNamespaces: {

      eip155: {
        methods: [
          "eth_sendTransaction",
          "eth_signTransaction",
          "eth_sign",
          "personal_sign",
          "eth_signTypedData"
        ],

        chains: ["eip155:1"],

        events: [
          "chainChanged",
          "accountsChanged"
        ]
      }

    }

  })

  const accounts = session?.namespaces.eip155.accounts

  const address = accounts[0].split(":")[2]

  return address
}