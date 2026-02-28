"use client";

import { useState, useMemo, useCallback } from "react";
import { useDisconnect, useAppKit } from "@reown/appkit/react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Eip1193Provider } from "ethers";
import UniversalProvider from "@walletconnect/universal-provider";
import { initWalletConnect, connectWallet1, disconnectWallet } from "../components/walletConnect";

/** Returns true if the current device is mobile */
function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export function useWallet() {
  // ── Reown AppKit (desktop) ──────────────────────────────────────────────
  const { disconnect: appKitDisconnect } = useDisconnect();
  const { address: appKitAddress, isConnected: appKitConnected } = useAppKitAccount();
  const { walletProvider: appKitWalletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const { open: appKitOpen } = useAppKit();

  const appKitProvider = useMemo(
    () => (appKitWalletProvider ? new BrowserProvider(appKitWalletProvider) : null),
    [appKitWalletProvider]
  );

  // ── WalletConnect Universal Provider (mobile) ───────────────────────────
  const [wcAddress, setWcAddress] = useState<string | null>(null);
  const [wcConnected, setWcConnected] = useState(false);
  const [wcProvider, setWcProvider] = useState<BrowserProvider | null>(null);

  // ── Shared UI state ─────────────────────────────────────────────────────
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const isMobile = isMobileDevice();

  // ── Unified values ───────────────────────────────────────────────────────
  const address = isMobile ? wcAddress : appKitAddress;
  const isConnected = isMobile ? wcConnected : appKitConnected;

  /**
   * Unified provider:
   *  - Mobile  → BrowserProvider wrapping the WalletConnect UniversalProvider
   *  - Desktop → BrowserProvider wrapping the Reown AppKit provider
   */
  const provider = isMobile ? wcProvider : appKitProvider;

  // ── Connect ──────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    if (isMobile) {
      alert("mobile")
      const universalProvider: UniversalProvider = await initWalletConnect();
      const addr = await connectWallet1(universalProvider);
      if (addr) {
        const bp = new BrowserProvider(universalProvider as unknown as Eip1193Provider);
        setWcProvider(bp);
        setWcAddress(addr);
        setWcConnected(true);
      }
    } else {
      // Desktop: open Reown AppKit modal
      await appKitOpen();
    }
  }, [isMobile, appKitOpen]);

  // ── Disconnect ───────────────────────────────────────────────────────────
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

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return {
    provider,        // ✅ unified — works for both WC and AppKit
    address,         // ✅ unified
    isConnected,     // ✅ unified
    connect,         // ✅ unified
    logout,          // ✅ unified
    isWalletOpen,
    setIsWalletOpen,
    formatAddress,
  };
}