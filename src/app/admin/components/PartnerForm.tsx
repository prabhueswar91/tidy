"use client";

import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { toast } from "react-hot-toast";

interface Partner {
  id?: number;
  name: string;
  coin: string;
  walletAddress?: string | null;
}

interface PartnerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  partner?: Partner; // if editing
}

export default function PartnerForm({ isOpen, onClose, onSuccess, partner }: PartnerFormProps) {
  const [name, setName] = useState("");
  const [coin, setCoin] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (partner) {
      setName(partner.name);
      setCoin(partner.coin);
      setWalletAddress(partner.walletAddress || "");
    } else {
      setName("");
      setCoin("");
      setWalletAddress("");
    }
  }, [partner]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (partner?.id) {
        const res = await axiosInstance.put(`/partner/${partner.id}`, {
          name,
          coin,
          walletAddress: walletAddress || null,
        });
        if (res.data.success) {
          toast.success("Partner updated successfully!");
          onSuccess();
          onClose();
        } else {
          toast.error(res.data.error || "Failed to update partner.");
        }
      } else {
        const res = await axiosInstance.post("/partner", {
          name,
          coin,
          walletAddress: walletAddress || null,
        });
        if (res.data.success) {
          toast.success("Partner added successfully!");
          onSuccess();
          onClose();
        } else {
          toast.error(res.data.error || "Failed to add partner.");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        toast.error(err.message || "Server error.");
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const e = err as { response?: { data?: { error?: string } } };
        toast.error(e.response?.data?.error || "Server error.");
      } else {
        toast.error("Server error.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4">{partner ? "Edit Partner" : "Add Partner"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            placeholder="Coin"
            value={coin}
            onChange={(e) => setCoin(e.target.value)}
            className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            placeholder="Wallet Address (optional)"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : partner ? "Update Partner" : "Add Partner"}
          </button>
        </form>
      </div>
    </div>
  );
}
