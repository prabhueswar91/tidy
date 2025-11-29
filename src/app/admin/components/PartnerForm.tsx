"use client";

import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { toast } from "react-hot-toast";

interface Partner {
  id: number;
  groupName: string;
  project: string;
  contact: string;
  duration: string;
  symbol?: string;
  walletAddress?: string | null;
  tokenAddress?: string | null;
  channelId: number;
  approved?: boolean;
  adminIds?: number[];
  url?: string | null;
  logo?: string | null;
}

interface PartnerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  partner?: Partner;
}

export default function PartnerForm({
  isOpen,
  onClose,
  onSuccess,
  partner,
}: PartnerFormProps) {
  const [groupName, setGroupName] = useState("");
  const [project, setProject] = useState("");
  const [contact, setContact] = useState("");
  const [duration, setDuration] = useState("");
  const [symbol, setSymbol] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [channelId, setChannelId] = useState<number | "">("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [approved, setApproved] = useState(false);
  const [url, seturl] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (partner) {
      let NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
      let logoUrl = `${NEXT_PUBLIC_BASE_URL}/uploads/partner_logos/${partner.logo}`
      setGroupName(partner.groupName);
      setProject(partner.project);
      setContact(partner.contact);
      setDuration(partner.duration);
      setSymbol(partner.symbol || "");
      setWalletAddress(partner.walletAddress || "");
      setChannelId(partner.channelId ?? "");
      setTokenAddress(partner.tokenAddress || "");
      setApproved(partner.approved ?? false);
      seturl(partner.url || "");
      setPreviewUrl(logoUrl || null);
    } else {
      setGroupName("");
      setProject("");
      setContact("");
      setDuration("");
      setSymbol("");
      setWalletAddress("");
      setChannelId("");
      setTokenAddress("");
      setApproved(false);
      seturl("");
      setLogo(null);
      setPreviewUrl(null);
    }
  }, [partner]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setLogo(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!groupName.trim()) return toast.error("Group Name is required.");
    if (!project.trim()) return toast.error("Project is required.");
    if (!contact.trim()) return toast.error("Contact is required.");
    if (!duration.trim()) return toast.error("Duration is required.");
    if (channelId === "" || isNaN(Number(channelId)))
      return toast.error("Channel ID is required.");

    try {
      const formData = new FormData();
      formData.append("groupName", groupName);
      formData.append("project", project);
      formData.append("contact", contact);
      formData.append("duration", duration);
      formData.append("symbol", symbol || "");
      formData.append("walletAddress", walletAddress || "");
      formData.append("channelId", String(channelId));
      formData.append("tokenAddress", tokenAddress || "");
      formData.append("approved", approved ? "true" : "false");
      formData.append("url", url || "");
      if (logo) formData.append("logo", logo);

      let res;
      if (partner?.id) {
        res = await axiosInstance.put(`/partner/${partner.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axiosInstance.post("/partner", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        toast.success(partner ? "Partner updated successfully!" : "Partner added successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(res.data.error || "Failed to save partner.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Server error.");
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
        <h2 className="text-lg font-bold mb-4">
          {partner ? "Edit Partner" : "Add Partner"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Group Name (required)"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            placeholder="Project (required)"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            placeholder="Contact (required)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            placeholder="Duration (required)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="url"
            placeholder="Website Link (optional)"
            value={url}
            onChange={(e) => seturl(e.target.value)}
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Logo Preview"
              className="w-20 h-20 rounded-md object-cover border"
            />
          )}

          <input
            type="number"
            placeholder="Channel ID (required)"
            value={channelId}
            onChange={(e) =>
              setChannelId(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            placeholder="Token Address (optional)"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Symbol (optional)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Wallet Address (optional)"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={approved}
              onChange={(e) => setApproved(e.target.checked)}
            />
            Approved
          </label>

          <button
            type="submit"
            className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : partner
              ? "Update Partner"
              : "Add Partner"}
          </button>
        </form>
      </div>
    </div>
  );
}
