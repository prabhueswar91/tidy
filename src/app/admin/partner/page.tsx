"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
import PartnerForm from "../components/PartnerForm";
import { AxiosError } from "axios";

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
  logo: string;
  url: string;
  isContribute: string;
  boosterId:number;
  createdAt: string;
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editPartner, setEditPartner] = useState<Partner | undefined>(
    undefined
  );

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/partner");
      if (res.data.success) setPartners(res.data.data);
      else toast.error(res.data.error || "Failed to fetch partners.");
    } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      const axiosErr = err as AxiosError<{ error: string }>;
      toast.error(axiosErr.response?.data?.error || err.message || "Server error.");
    } else {
      console.error("Unknown error", err);
      toast.error("Server error.");
    }
  } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleEdit = (partner: Partner) => {
    setEditPartner(partner);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditPartner(undefined);
    setIsFormOpen(true);
  };

  const handleApprovalChange = async (id: number, approved: boolean) => {
    try {
      const res = await axiosInstance.put(`/partner/${id}`, { approved });
      if (res.data.success) {
        toast.success("Approval status updated!");
        setPartners((prev) =>
          prev.map((p) => (p.id === id ? { ...p, approved } : p))
        );
      } else {
        toast.error(res.data.error || "Failed to update approval.");
      }
    } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      const axiosErr = err as AxiosError<{ error: string }>;
      toast.error(axiosErr.response?.data?.error || err.message || "Server error.");
    } else {
      console.error("Unknown error", err);
      toast.error("Server error.");
    }
  }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Partners</h2>
        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
        >
          Add Partner
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Group Name</th>
                <th className="px-4 py-2 border">Project</th>
                <th className="px-4 py-2 border">Contact</th>
                <th className="px-4 py-2 border">Duration</th>
                <th className="px-4 py-2 border">Symbol</th>
                <th className="px-4 py-2 border">Wallet Address</th>
                <th className="px-4 py-2 border">Token Address</th>
                <th className="px-4 py-2 border">Channel ID</th>
                <th className="px-4 py-2 border">Logo</th>
                <th className="px-4 py-2 border">Website Link</th>
                <th className="px-4 py-2 border">Contribute</th>
                <th className="px-4 py-2 border">Booster</th>
                <th className="px-4 py-2 border">Booster Id</th>
                <th className="px-4 py-2 border">Approved</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner.id} className="odd:bg-white even:bg-gray-100">
                  <td className="px-4 py-2 border">{partner.id}</td>
                  <td className="px-4 py-2 border">{partner.groupName}</td>
                  <td className="px-4 py-2 border">{partner.project}</td>
                  <td className="px-4 py-2 border">{partner.contact}</td>
                  <td className="px-4 py-2 border">{partner.duration}</td>
                  <td className="px-4 py-2 border">{partner.symbol || "-"}</td>
                  <td className="px-4 py-2 border">
                    {partner.walletAddress || "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    {partner.tokenAddress || "-"}
                  </td>
                  <td className="px-4 py-2 border">{partner.channelId}</td>
                  <td className="px-4 py-2 border">
                      {partner.logo ? (
                        <img
                          src={partner.logo.startsWith("http") ? partner.logo : `${process.env.NEXT_PUBLIC_BASE_URL}/uploads1/partner_logos/${partner.logo}`}
                          alt={`${partner.project} logo`}
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {partner.url ? (
                        <a
                          href={partner.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Click
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2 border">{partner.isContribute?"Yes":"No"}</td>
                    <td className="px-4 py-2 border">{partner.boosterId>0?"Paid":"-"}</td>
                    <td className="px-4 py-2 border">{partner.boosterId}</td>
                  <td className="px-4 py-2 border text-center">
                    <input
                      type="checkbox"
                      checked={partner.approved === true}
                      onChange={() =>
                        handleApprovalChange(partner.id, !partner.approved)
                      }
                      className="cursor-pointer w-5 h-5"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleEdit(partner)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PartnerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchPartners}
        partner={editPartner}
      />
    </div>
  );
}
