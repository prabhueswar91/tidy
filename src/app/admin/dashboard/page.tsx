"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";

interface Stats {
  users: number;
  partners: number;
  rewards: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/stats");
      if (res.data.success) {
        setStats(res.data.data);
      } else {
        toast.error(res.data.error || "Failed to fetch stats.");
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
    fetchStats();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-500 text-white rounded-lg p-6 shadow-md flex flex-col items-center">
            <p className="text-lg font-semibold">Users</p>
            <p className="text-3xl font-bold">{stats?.users ?? 0}</p>
          </div>

          <div className="bg-green-500 text-white rounded-lg p-6 shadow-md flex flex-col items-center">
            <p className="text-lg font-semibold">Partners</p>
            <p className="text-3xl font-bold">{stats?.partners ?? 0}</p>
          </div>

          <div className="bg-yellow-500 text-white rounded-lg p-6 shadow-md flex flex-col items-center">
            <p className="text-lg font-semibold">Rewards</p>
            <p className="text-3xl font-bold">{stats?.rewards ?? 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}
