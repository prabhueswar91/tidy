"use client";

import { useState, useMemo, useCallback } from "react";
import { useDisconnect, useAppKit } from "@reown/appkit/react";
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

  const [wcAddress, setWcAddress] = useState<string | null>(null);
  const [wcConnected, setWcConnected] = useState(false);
  const [wcProvider, setWcProvider] = useState<BrowserProvider | null>(null);

  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const isMobile = isMobileDevice();

  const address = isMobile ? wcAddress : appKitAddress;
  const isConnected = isMobile ? wcConnected : appKitConnected;

  const provider = isMobile ? wcProvider : appKitProvider;

  const connect = useCallback(async () => {
    alert(window?.location?.origin)
    if (isMobile) {
      
      const universalProvider: UniversalProvider = await initWalletConnect();
      const addr = await mobileConect(universalProvider);
      if (addr) {
        const bp = new BrowserProvider(universalProvider as unknown as Eip1193Provider);
        setWcProvider(bp);
        setWcAddress(addr);
        setWcConnected(true);
      }
    } else {
      await appKitOpen();
    }
  }, [isMobile, appKitOpen]);

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
    connect,
    logout,
    isWalletOpen,
    setIsWalletOpen,
    formatAddress,
  };
}