"use client"

import UniversalProvider from "@walletconnect/universal-provider"
import { WalletConnectModal } from "@walletconnect/modal"

let provider: UniversalProvider | null = null
let modal: WalletConnectModal | null = null

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 8453);
const CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME || "Base";
const CHAIN_RPC = process.env.NEXT_PUBLIC_CHAIN_RPC || "https://mainnet.base.org";
const BLOCK_EXPLORER = process.env.NEXT_PUBLIC_BLOCK_EXPLORER || "https://basescan.org";

const CHAIN_CONFIG = {
  chainId: `0x${CHAIN_ID.toString(16)}`,
  chainName: CHAIN_NAME,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: [CHAIN_RPC],
  blockExplorerUrls: [BLOCK_EXPLORER],
};


export async function initWalletConnect(): Promise<UniversalProvider> {
  if (provider) return provider

  provider = await UniversalProvider.init({
    projectId,
    metadata: {
      name: "TIDYZEN",
      description: "TIDYZEN",
      url: typeof window !== "undefined" ? window.location.origin : "",
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

async function switchToChain(wcProvider: UniversalProvider): Promise<void> {
  const hexChainId = CHAIN_CONFIG.chainId;

  try {
    await wcProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });
  } catch (switchError: any) {
    if (switchError?.code === 4902 || switchError?.message?.includes("wallet_addEthereumChain")) {
      await wcProvider.request({
        method: "wallet_addEthereumChain",
        params: [CHAIN_CONFIG],
      });
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
  await switchToChain(wcProvider);


  return address
}

export async function disconnectWallet(): Promise<void> {
  if (!provider) return
  await provider.disconnect()
  provider = null
}
