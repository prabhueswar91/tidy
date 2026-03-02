"use client";

import { useEffect, useState } from "react";
import { Contract, parseUnits, formatUnits, JsonRpcProvider } from "ethers";
import { toast } from "react-hot-toast";
import Modal from "../components/ui/Modal"; // adjust path if needed
import axiosInstance from "../utils/axiosInstance"; // adjust path if needed
import { useWallet } from "../hooks/useWallet";
import { encryptData } from "../rewards/auth2/encrypt";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)",
];
const BASE_SEPOLIA_RPC = process.env.BASE_RPC;
const readProvider = new JsonRpcProvider(BASE_SEPOLIA_RPC);

export type BoosterPlan = { id: number; label: string; price: number };

const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as string;
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET as string;
const CHAIN_ID = process.env.CHAIN_ID as string;

export default function PayBoosterModal({
  isOpen,
  onClose,
  selectedPlan,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: BoosterPlan | null;
  onSuccess: () => void;
}) {
  
  const { provider, address, isConnected, connect, logout, formatAddress,chainId } =
    useWallet();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [balLoading, setBalLoading] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState("0");
  const [decimals, setDecimals] = useState(6);

  const loadUsdcBalance = async () => {
  try {
    if (!address) return;

    setBalLoading(true);

    const token = new Contract(
      USDC_ADDRESS,
      ERC20_ABI,
      readProvider
    );

    let d = Number(await token.decimals());
    setDecimals(d);

    const bal = await token.balanceOf(address);

    setUsdcBalance(formatUnits(bal, d));

  } catch (err) {
    console.error(err);
    setUsdcBalance("0");
  } finally {
    setBalLoading(false);
  }
};

  useEffect(() => {
    if (isOpen && isConnected) loadUsdcBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isConnected]);

 const payAndActivate = async () => {
  try {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    if (!USDC_ADDRESS) {
      toast.error("Configuration error");
      return;
    }

    if (!isConnected || !address || !provider) {
      toast("Connect wallet first");
      await connect();
      return;
    }

    // if(Number(CHAIN_ID) !=chainId){
    //   toast.error("Please switch to base network");
    //   return;
    // }

    setPaying(true);

    // 🔥 FAST READS (RPC)
    const readToken = new Contract(
      USDC_ADDRESS,
      ERC20_ABI,
      readProvider
    );

    let d = Number(await readToken.decimals());
    const amount = parseUnits(String(selectedPlan.price), d);

    const tokenBal = await readToken.balanceOf(address);

    if (tokenBal < amount) {
      toast.error(
        `Insufficient USDC. Balance: ${formatUnits(tokenBal, d)}`
      );
      return;
    }

    const nativeBal = await readProvider.getBalance(address);

    if (nativeBal <= 0) {
      toast.error("Insufficient ETH for gas");
      return;
    }

    // 🔥 WRITE ONLY THROUGH WALLETCONNECT
    const signer = await provider.getSigner();
    const writeToken = new Contract(
      USDC_ADDRESS,
      ERC20_ABI,
      signer
    );
    //alert("transfer")
    const tx = await writeToken.transfer(
      ADMIN_WALLET,
      amount
    );

    toast.success("Transaction submitted");

    const receipt = await readProvider.waitForTransaction(tx.hash);

    //const receipt = await tx.wait();

     //toast.success("Transaction submitted222");

    if (!receipt || receipt.status !== 1) {
      toast.error("Transaction failed");
      return;
    }

    //toast.success(tx.hash);

    // backend logic unchanged
    const payload = encryptData({
      subscriptionId: selectedPlan.id,
      txHash: tx.hash,
      walletAddress: address,
      price: String(selectedPlan.price),
      token: "USDC",
      initData: window?.Telegram?.WebApp?.initData,
      partnerId: id,
    });

    const res = await axiosInstance.post(
      "/points/activate-booster",
      { data: payload }
    );

    if (res.data?.status) {
      toast.success(
        "Booster request sent successfully."
      );
      onSuccess();
      router.push(`/partner`);
    } else {
      toast.error(res.data?.error || "Failed to submit");
    }
  } catch (err: any) {
    console.error(err);
    toast.error(
      err?.shortMessage ||
        err?.reason ||
        err?.message ||
        "Payment failed"
    );
  } finally {
    setPaying(false);
  }
};

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="text-base font-dm font-[500] my-2 text-center uppercase text-[#FFFEEF]">
          {isConnected ? "Confirm Payment" : "Connect Wallet to Pay"}
        </div>

        {selectedPlan && (
          <div className="flex justify-between items-center">
            <div className="font-bold text-xl text-[#FFFEEF]">Total</div>
            <div className="text-right">
              <div className="text-xs text-[#929292] font-medium">
                SELECTED PLAN
              </div>
              <div className="text-[#FFFEEF] text-base font-semibold">
                {selectedPlan.label} · {selectedPlan.price} USDC
              </div>
            </div>
          </div>
        )}

        {isConnected ? (
          <div className="rounded-xl border border-[#FFFEEF]/10 bg-black/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-[#FFFEEF]/70">Wallet</div>
              <div className="text-sm text-[#FFFEEF] font-semibold">
                {address ? formatAddress(address) : ""}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-[#FFFEEF]/70">USDC Balance</div>
              <div className="text-sm text-[#FFFEEF] font-semibold">
                {balLoading
                  ? "Loading..."
                  : `${Number(usdcBalance).toFixed(4)} USDC`}
              </div>
            </div>

            <div className="mt-3 flex gap-3">
              
              <button
                className="flex-1 px-4 py-2 rounded-lg border border-red-500/40 text-red-200 hover:bg-red-500/10 transition"
                onClick={() => {
                  logout();
                  setUsdcBalance("0");
                  toast.success("Disconnected");
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[#FFFEEF]/10 bg-black/30 p-4">
            <p className="text-sm text-[#FFFEEF]/70">
              Please connect your wallet to continue.
            </p>

            <button
              className="mt-3 w-full bg-[linear-gradient(90deg,#242424_0%,#525252_100%)] hover:opacity-90 text-[#FFFEEF] font-semibold py-3 rounded-full border border-[#FFFEEF]/10"
              onClick={async () => {
                await connect();
                setTimeout(() => loadUsdcBalance(), 600);
              }}
            >
              Connect Wallet
            </button>
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-full border border-[#FFFEEF]/10 text-[#FFFEEF] hover:bg-white/5 transition"
          >
            Cancel
          </button>

          <button
            className="flex-1 bg-[linear-gradient(90deg,#f5d35f_0%,#d6a532_100%)] text-black hover:opacity-90 font-bold py-3 rounded-full border border-yellow-400/40 disabled:opacity-50"
            disabled={!isConnected || !selectedPlan || paying}
            onClick={payAndActivate}
          >
            {paying ? "Processing..." : "Pay Now"}
          </button>
        </div>

        <p className="text-center text-xs text-[#FFFEEF]/45">
          Activation starts after admin approval.
        </p>
      </div>
    </Modal>
  );
}
