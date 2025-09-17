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
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/users");
      if (res.data.success) {
        setUsers(res.data.data);
      } else {
        toast.error(res.data.error || "Failed to fetch users.");
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
    fetchUsers();
  }, []);

  return (
    <div className="p-4 bg-gray-50 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Users</h2>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Profile</th>
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Phone Number</th>
                <th className="px-4 py-2 border">Telegram ID</th>
                <th className="px-4 py-2 border">Tier</th>
                <th className="px-4 py-2 border">Wallet Address</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="odd:bg-white even:bg-gray-100">
                  <td className="px-4 py-2 border">
                    {user.profilePhotoUrl ? (
                      <img
                        src={user.profilePhotoUrl}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 border">{user.username}</td>
                  <td className="px-4 py-2 border">{user.phoneNumber || ""}</td>
                  <td className="px-4 py-2 border">{user.telegramId}</td>
                  <td className="px-4 py-2 border">{user.tier}</td>
                  <td className="px-4 py-2 border">{user.walletAddress || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
