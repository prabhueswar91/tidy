"use client"

import UniversalProvider from "@walletconnect/universal-provider"
import { WalletConnectModal } from "@walletconnect/modal"

let provider: UniversalProvider | null = null
let modal: WalletConnectModal | null = null

const projectId = "b01f86bb575d8820ed3e4337491b9685"

/** Initialises (once) and returns the UniversalProvider instance */
export async function initWalletConnect(): Promise<UniversalProvider> {
  if (provider) return provider          // reuse if already initialised

  provider = await UniversalProvider.init({
    projectId,
    metadata: {
      name: "My Website",
      description: "WalletConnect Example",
      url: window.location.origin,
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

/**
 * Opens the WalletConnect modal and resolves with the connected address.
 * Accepts the UniversalProvider returned from initWalletConnect().
 */
export async function connectWallet1(wcProvider: UniversalProvider): Promise<string> {
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
        chains: ["eip155:1"],
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
  provider = null   // reset so initWalletConnect re-creates on next connect
}