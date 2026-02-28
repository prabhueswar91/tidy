"use client";

import { useState, useMemo, useCallback,useEffect } from "react";
import { useDisconnect, useAppKit,useAppKitNetwork } from "@reown/appkit/react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Eip1193Provider } from "ethers";
import UniversalProvider from "@walletconnect/universal-provider";
import { initWalletConnect, mobileConect, disconnectWallet } from "../components/walletConnect";

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export function useWallet() {
  const { disconnect: appKitDisconnect } = useDisconnect();
  const { address: appKitAddress, isConnected: appKitConnected } = useAppKitAccount();
  const { walletProvider: appKitWalletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const { open: appKitOpen } = useAppKit();

  const appKitProvider = useMemo(
    () => (appKitWalletProvider ? new BrowserProvider(appKitWalletProvider) : null),
    [appKitWalletProvider]
  );
  const { caipNetwork } = useAppKitNetwork();
  const appKitChainId = caipNetwork?.id ?? null;
  const [wcAddress, setWcAddress] = useState<string | null>(null);
  const [wcConnected, setWcConnected] = useState(false);
  const [wcProvider, setWcProvider] = useState<BrowserProvider | null>(null);

  const [isWalletOpen, setIsWalletOpen] = useState(false);
   const [wcChainId, setWcChainId] = useState<number | null>(null);
  const isMobile = isMobileDevice();

  const address = isMobile ? wcAddress : appKitAddress;
  const isConnected = isMobile ? wcConnected : appKitConnected;

  const provider = isMobile ? wcProvider : appKitProvider;

  const chainId: number | null = isMobile ? wcChainId : (appKitChainId ? Number(appKitChainId) : null);

  const connect = useCallback(async () => {
   
    if (isMobile) {
      
      const universalProvider: UniversalProvider = await initWalletConnect();
      const addr = await mobileConect(universalProvider);
      if (addr) {
        const CHAIN_ID = process.env.CHAIN_ID!;
        alert(CHAIN_ID)
        const bp = new BrowserProvider(universalProvider as unknown as Eip1193Provider);
        const network = await bp.getNetwork();
        alert(network.chainId)
        setWcProvider(bp);
        setWcAddress(addr);
        setWcConnected(true);
        setWcChainId(Number(network.chainId));
      }
    } else {
      await appKitOpen();
    }
  }, [isMobile, appKitOpen]);


  useEffect(() => {
    if (isMobile && wcProvider) {
      wcProvider.getNetwork().then((network) => {
        setWcChainId(Number(network.chainId));
      }).catch(() => setWcChainId(null));
    }
  }, [isMobile, wcProvider]);

  const logout = useCallback(async () => {
    if (isMobile) {
      await disconnectWallet();
      setWcAddress(null);
      setWcConnected(false);
      setWcProvider(null);
    } else {
      appKitDisconnect();
    }
  }, [isMobile, appKitDisconnect]);

  const formatAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return {
    provider,
    address,
    isConnected,
    chainId,
    connect,
    logout,
    isWalletOpen,
    setIsWalletOpen,
    formatAddress,
  };
}