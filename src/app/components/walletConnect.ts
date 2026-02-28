"use client"

import UniversalProvider from "@walletconnect/universal-provider"
import { WalletConnectModal } from "@walletconnect/modal"

let provider: UniversalProvider | null = null
let modal: WalletConnectModal | null = null

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
//const CHAIN_ID = process.env.CHAIN_ID!;
const CHAIN_ID = 84532;

const BASE_SEPOLIA_CONFIG = {
  chainId: `0x${CHAIN_ID.toString(16)}`, // "0x14a34"
  chainName: "Base Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://sepolia.base.org"],
  blockExplorerUrls: ["https://sepolia.basescan.org"],
};


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

async function switchToBaseSepolia(wcProvider: UniversalProvider): Promise<void> {
  const hexChainId = BASE_SEPOLIA_CONFIG.chainId;

  try {
    // Try switching first — works if wallet already has Base Sepolia
    await wcProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });
  } catch (switchError: any) {
    // 4902 = chain not added to wallet yet
    if (switchError?.code === 4902 || switchError?.message?.includes("wallet_addEthereumChain")) {
      await wcProvider.request({
        method: "wallet_addEthereumChain",
        params: [BASE_SEPOLIA_CONFIG],
      });
      // Switch again after adding
      await wcProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
    } else {
      throw switchError;
    }
  }
}


export async function mobileConect(wcProvider: UniversalProvider): Promise<string> {
  //alert(CHAIN_ID)
  const session = await wcProvider.connect({
    optionalNamespaces: {
      eip155: {
        methods: [
          "eth_sendTransaction",
          "eth_signTransaction",
          "eth_sign",
          "personal_sign",
          "eth_signTypedData",
          "wallet_switchEthereumChain",
          "wallet_addEthereumChain",
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
  await switchToBaseSepolia(wcProvider);


  return address
}

export async function disconnectWallet(): Promise<void> {
  if (!provider) return
  await provider.disconnect()
  provider = null
}