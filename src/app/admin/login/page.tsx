"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../components/axiosInstance";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setError("");
      const response = await axiosInstance.post("/admin/login", {
        email,
        password,
      });

      if (response.data.success) {
        toast.success("Login successful!");
        localStorage.setItem("token", response.data.token);
        router.push("/admin/dashboard");
      } else {
        setError(response.data.error || "Login failed.");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);

      if (err instanceof Error) {
        // Standard JS error
        setError(err.message);
        toast.error(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        // Likely an Axios-style error
        const e = err as { response?: { data?: { error?: string } } };
        const msg = e.response?.data?.error || "An unexpected error occurred.";
        setError(msg);
        toast.error(msg);
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login to TIDYZEN</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
           {"Don't have an account? "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
