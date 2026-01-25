"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";

interface User {
  id: number;
  username: string;
  phoneNumber?: string;
  telegramId: number;
  tier: string;
  walletAddress?: string | null;
  profilePhotoUrl?: string | null;
  createdAt: string; 
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isExport, setisExport] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/users", {
        params: { search, page, limit },
      });

      if (res.data.success) {
        setUsers(res.data.data);
        setTotal(res.data.total);
      } else {
        toast.error(res.data.error || "Failed to fetch users.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Server error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);

  async function exportUsers(){
    try {
      setisExport(true)
      const res = await axiosInstance.get("/admin/users/export", {
        params: { search },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed");
    }finally{
      setisExport(false)
    }

  }

  return (
    <div className="p-4 bg-gray-50 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Users</h2>

      
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search username / phone / telegram / wallet"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-1 rounded w-80"
        />

        <button
          onClick={() => {
            setPage(1);
            fetchUsers();
          }}
          className="flex items-center gap-3 px-3 py-3 rounded-lg font-semibold border-2 transition-all duration-300 border-[#D2A100] bg-gradient-to-br from-[#110E05] to-[#362A02] text-white hover:border-yellow-500 hover:from-[#362A02] hover:to-[#110E05] hover:text-white"
        >
          Search
        </button>

        <button
          onClick={exportUsers}
          className="flex items-center gap-3 px-3 py-3 rounded-lg font-semibold border-2 transition-all duration-300 border-[#D2A100] bg-gradient-to-br from-[#110E05] to-[#362A02] text-white hover:border-yellow-500 hover:from-[#362A02] hover:to-[#110E05] hover:text-white"
        >
          {isExport?"Downloading..":"Export CSV"}
        </button>
      </div>


      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-3 py-2">Date</th>
                  <th className="border px-3 py-2">Telegram ID</th>
                  {/* <th className="border px-3 py-2">Profile</th> */}
                  <th className="border px-3 py-2">Username</th>
                  <th className="border px-3 py-2">Phone</th>
                  <th className="border px-3 py-2">Tier</th>
                  <th className="border px-3 py-2">Wallet</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2 border">
                    {new Date(user.createdAt).toLocaleDateString()}{" "}
                    {new Date(user.createdAt).toLocaleTimeString()}
                  </td>
                    <td className="border px-3 py-2">{user.telegramId}</td>
                    {/* <td className="border px-3 py-2">
                      {user.profilePhotoUrl ? (
                        <img
                          src={user.profilePhotoUrl}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          N/A
                        </div>
                      )}
                    </td> */}
                    <td className="border px-3 py-2">{user.username}</td>
                    <td className="border px-3 py-2">{user.phoneNumber || ""}</td>
                    <td className="border px-3 py-2">{user.tier}</td>
                    <td className="border px-3 py-2">
                      {user.walletAddress || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div>
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="border px-2 py-1 rounded"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
