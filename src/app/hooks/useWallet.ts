"use client";

import { useState, useMemo } from "react";
import { useAppKitWallet } from "@reown/appkit-wallet-button/react";
import { useDisconnect } from "@reown/appkit/react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Eip1193Provider } from "ethers";

export function useWallet() {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAppKitAccount();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");

  const provider = useMemo(
    () => (walletProvider ? new BrowserProvider(walletProvider) : null),
    [walletProvider]
  );

  const { connect, isReady } = useAppKitWallet({
    namespace: "eip155",
    onSuccess: (addr) => {
      console.log(addr)
      alert("sucesss"),
      setIsWalletOpen(false);
    },
    onError: (err) => alert(err),
  });

  const logout = () => disconnect();

  const formatAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return {
    provider,
    address,
    isConnected,
    connect,
    isReady,
    logout,
    isWalletOpen,
    setIsWalletOpen,
    formatAddress,
  };
}
