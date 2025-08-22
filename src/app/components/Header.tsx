"use client";

import { useState } from "react";
import Button from "./ui/Button";
import Modal from "./ui/Modal";

import { useAppKitWallet } from "@reown/appkit-wallet-button/react";
import { useDisconnect } from "@reown/appkit/react";
import { useAppKitAccount } from "@reown/appkit/react";

export default function Header() {

    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAppKitAccount();

    const [isWalletOpen, setIsWalletOpen] = useState(false);

    const { connect, isReady } = useAppKitWallet({
        namespace: "eip155",
        onSuccess: (address) =>{
            console.log(address,'address>>>>>>>')
            setIsWalletOpen(false);
        },
        onError: (err) => console.error("Connection error:", err),
    });

    const openModal = () => setIsWalletOpen(true);
    const logout = () => disconnect();
    const copyToClipboard = () => {
        if (address) {
            navigator.clipboard.writeText(address);
        }
    };

    const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 10)}...${addr.slice(-10)}`;
    };

  return (
    <div className="flex min-h-screen items-center font-dm justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1e293b] px-6">
        {isConnected ? (
        <div className="flex flex-col items-center space-y-2 bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-200">
              {formatAddress(address?address:"")}
            </span>
          </div>
          <Button
            onClick={logout}
            className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={openModal}
          className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500"
        >
          Connect Wallet
        </Button>
      )}
      
        <Modal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)}>
        <h2 className="text-2xl font-bold my-6 text-center">
            Connect Wallet
        </h2>

        
        <div className="flex flex-col items-center mb-6">
            <button
            className="m-2 px-4 py-2 bg-yellow-300 rounded w-56 font-semibold"
            onClick={() => connect("metamask")}
            >
            Connect MetaMask
            </button>

            {/* <button
            className="m-2 px-4 py-2 bg-purple-300 rounded w-56 font-semibold"
            onClick={() => connect("phantom")}
            >
            Connect Phantom
            </button> */}

            <button
            className="m-2 px-4 py-2 bg-blue-300 rounded w-56 font-semibold"
            onClick={() => connect("walletConnect")}
            disabled={!isReady}
            >
            Trust Wallet
            </button>

            <button
            className="m-2 px-4 py-2 bg-green-300 rounded w-56 font-semibold"
            onClick={() => connect("coinbase")}
            disabled={!isReady}
            >
            Connect Coinbase Wallet
            </button>
        </div>
        </Modal>
    </div>
  );
}
