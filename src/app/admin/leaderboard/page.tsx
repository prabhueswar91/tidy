"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";

interface User {
  userId: number;
  username: string;
  telegramId: number;
  totalPoint: string;
  walletAddress: string;
}

export default function AdminLeaderList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isExport, setisExport] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/admin/leader-list", {
        params: {
          fromDate,
          toDate,
          search,
          page,
          limit,
        },
      });

      if (res.data.success) {
        setUsers(res.data.data);
        setTotal(res.data.total);
      } else {
        toast.error(res.data.error || "Failed to fetch leaderboard.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Server error.");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      setisExport(true)
      const res = await axiosInstance.get("/admin/leader-list/export", {
        params: { fromDate, toDate, search },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leaderboard.csv";
      a.click();
    } catch {
      toast.error("CSV export failed.");
    }finally{
      setisExport(false)
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);

  async function clearSearch(){
      setFromDate("")
      setToDate('')
      setSearch("")

      try {
      setLoading(true);

      const res = await axiosInstance.get("/admin/leader-list", {
        params: {
          fromDate:"",
          toDate:"",
          search:"",
          page,
          limit,
        },
      });

      if (res.data.success) {
        setUsers(res.data.data);
        setTotal(res.data.total);
      } else {
        toast.error(res.data.error || "Failed to fetch leaderboard.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Server error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 bg-gray-50 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Leaderboard List</h2>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="Search username / telegram ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded w-60"
        />
        <button
          onClick={() => {
            setPage(1);
            fetchUsers();
          }}
          className="flex items-center gap-3 px-3 py-3 rounded-lg font-semibold border-2 transition-all duration-300 border-[#D2A100] bg-gradient-to-br from-[#110E05] to-[#362A02] text-[#737157] hover:border-yellow-500 hover:from-[#362A02] hover:to-[#110E05] hover:text-white"
        >
          Search
        </button>
        <button
          onClick={()=>clearSearch()}
          className="flex items-center gap-3 px-3 py-3 rounded-lg font-semibold border-2 transition-all duration-300 border-[#D2A100] bg-gradient-to-br from-[#110E05] to-[#362A02] text-[#737157] hover:border-yellow-500 hover:from-[#362A02] hover:to-[#110E05] hover:text-white"
        >
          Clear
        </button>
        <button
          onClick={exportCSV}
          className="flex items-center gap-3 px-3 py-3 rounded-lg font-semibold border-2 transition-all duration-300 border-[#D2A100] bg-gradient-to-br from-[#110E05] to-[#362A02] text-[#737157] hover:border-yellow-500 hover:from-[#362A02] hover:to-[#110E05] hover:text-white"
        >
          {isExport?"Downloading..":"Export CSV"}
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <table className="min-w-full table-auto border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-3 py-2">Telegram ID</th>
                <th className="border px-3 py-2">Username</th>
                <th className="border px-3 py-2">Total Point</th>
                <th className="border px-3 py-2">Wallet Address</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userId}>
                  <td className="border px-3 py-2">{u.telegramId}</td>
                  <td className="border px-3 py-2">{u.username}</td>
                  <td className="border px-3 py-2">{u.totalPoint}</td>
                  <td className="border px-3 py-2">{u.walletAddress || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
