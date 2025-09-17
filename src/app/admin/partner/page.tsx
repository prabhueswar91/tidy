"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
import PartnerForm from "../components/PartnerForm";

interface Partner {
  id: number;
  name: string;
  coin: string;
  walletAddress: string | null;
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editPartner, setEditPartner] = useState<Partner | undefined>(undefined);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/partner");
      if (res.data.success) {
        setPartners(res.data.data);
      } else {
        toast.error(res.data.error || "Failed to fetch partners.");
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
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Coin</th>
                <th className="px-4 py-2 border">Wallet Address</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner.id} className="odd:bg-white even:bg-gray-100">
                  <td className="px-4 py-2 border">{partner.id}</td>
                  <td className="px-4 py-2 border">{partner.name}</td>
                  <td className="px-4 py-2 border">{partner.coin}</td>
                  <td className="px-4 py-2 border">{partner.walletAddress || "-"}</td>
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
