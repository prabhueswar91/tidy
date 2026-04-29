"use client";

import { useState, useEffect, useRef } from "react";
import axiosInstance from "../components/axiosInstance";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiBell, FiStopCircle, FiRefreshCw, FiEye } from "react-icons/fi";

const BTN =
  "flex items-center gap-3 px-5 py-3 rounded-lg font-semibold border-2 transition-all duration-300 border-[#D2A100] bg-gradient-to-br from-[#110E05] to-[#362A02] text-white hover:border-yellow-500 hover:from-[#362A02] hover:to-[#110E05] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed";

interface Job {
  jobId: string;
  status: string;
  total: number;
  processed: number;
  sent: number;
  failed: number;
}

interface HistoryJob {
  id: number;
  jobId: string;
  message: string;
  target: string;
  total: number;
  sent: number;
  failed: number;
  status: string;
  createdAt: string;
  canResend?: boolean;
}

export default function AdminNotifications() {
  const [target, setTarget] = useState("all");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [history, setHistory] = useState<HistoryJob[]>([]);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyPage, setHistoryPage] = useState(1);
  const historySearch = "";
  const historyLimit = 5;
  const [selectedJob, setSelectedJob] = useState<HistoryJob | null>(null);
  const [resending, setResending] = useState(false);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    fetchHistory();
    return () => stopPolling();
  }, []);

  const fetchHistory = async (page = historyPage, search = historySearch) => {
    try {
      const res = await axiosInstance.get(`/admin/notification-jobs?page=${page}&limit=${historyLimit}&search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setHistory(res.data.data);
        setHistoryTotal(res.data.total);
      }
    } catch {
      // silently fail
    }
  };

  const viewJobDetail = async (jobId: string) => {
    try {
      const res = await axiosInstance.get(`/admin/notification-job/${jobId}`);
      if (res.data.success) setSelectedJob(res.data.data);
    } catch {
      toast.error("Failed to load job details.");
    }
  };

  const handleResend = async (jobId: string) => {
    setResending(true);
    try {
      const res = await axiosInstance.post(`/admin/resend-notification/${jobId}`);
      if (res.data.success) {
        toast.success(`Resend started for ${res.data.total} failed users.`);
        setSelectedJob(null);
        setJob({
          jobId: res.data.jobId,
          status: "running",
          total: res.data.total,
          processed: 0,
          sent: 0,
          failed: 0,
        });
        setLoading(true);
        pollStatus(res.data.jobId);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error?.response?.data?.error || "Failed to resend.");
    } finally {
      setResending(false);
    }
  };

  const pollStatus = (jobId: string) => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`${baseURL}/admin/notification-status/${jobId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.data.success) {
          setJob(res.data);
          if (res.data.status === "done" || res.data.status === "cancelled") {
            stopPolling();
            setLoading(false);
            fetchHistory();
            if (res.data.status === "done") {
              toast.success(`Done! ${res.data.sent}/${res.data.total} delivered.`);
            } else {
              toast("Notification cancelled.", { icon: "!" });
            }
          }
        }
      } catch (err: unknown) {
        const error = err as { response?: { status?: number } };
        if (error?.response?.status === 404) {
          stopPolling();
          setLoading(false);
          setJob(null);
          fetchHistory();
          toast.error("Server restarted mid-job. Please re-send.");
        }
      }
    }, 2000);
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }
    setLoading(true);
    setJob(null);
    stopPolling();

    try {
      const res = await axiosInstance.post("/admin/send-notification", {
        target,
        message: message.trim(),
      });

      if (res.data.success) {
        setJob({
          jobId: res.data.jobId,
          status: "running",
          total: res.data.total,
          processed: 0,
          sent: 0,
          failed: 0,
        });
        setMessage("");
        toast.success(`Sending started — ${res.data.total.toLocaleString()} users in queue.`);
        pollStatus(res.data.jobId);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error?.response?.data?.error || "Failed to start notification.");
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!job) return;
    try {
      await axiosInstance.post(`/admin/cancel-notification/${job.jobId}`);
      toast("Cancellation requested...", { icon: "!" });
    } catch {
      toast.error("Failed to cancel.");
    }
  };

  const progress = job && job.total > 0 ? Math.round((job.processed / job.total) * 100) : 0;
  const estMinutes = job && job.total > 0 && job.status === "running"
    ? Math.ceil((job.total - job.processed) / 25 / 60)
    : null;

  const targetLabel: Record<string, string> = {
    all: "All Users", bronze: "Bronze", silver: "Silver", gold: "Gold",
    wallet: "Wallet", group: "Group", premium: "Premium", resend: "Resend",
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#0a1a0a" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FiBell size={28} className="text-yellow-400" />
          <h1 className="text-2xl font-bold text-white">Send Notification</h1>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border-2 border-[#D2A100] p-6 space-y-6" style={{ backgroundColor: "#033503ff" }}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#D2A100] uppercase tracking-wide">Send To</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg px-4 py-3 text-white font-medium border-2 border-[#D2A100] outline-none focus:border-yellow-400 transition-colors"
              style={{ backgroundColor: "#110E05" }}
            >
              <option value="all">All Users</option>
              <option value="bronze">Bronze Tier Users</option>
              <option value="silver">Silver Tier Users</option>
              <option value="gold">Gold Tier Users</option>
              <option value="wallet">Wallet Connected Users</option>
              <option value="group">Telegram Group Members</option>
              <option value="premium">Telegram Premium Users</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#D2A100] uppercase tracking-wide">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here... (HTML supported: <b>bold</b>, <i>italic</i>)"
              rows={5}
              disabled={loading}
              className="w-full rounded-lg px-4 py-3 text-white placeholder-gray-500 font-medium border-2 border-[#D2A100] outline-none focus:border-yellow-400 transition-colors resize-none disabled:opacity-60"
              style={{ backgroundColor: "#110E05" }}
            />
            <p className="text-xs text-gray-400">
              Supports Telegram HTML: &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;a href=&quot;...&quot;&gt;link&lt;/a&gt;
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSend} disabled={loading || !message.trim()} className={BTN}>
              <FiBell size={18} />
              {loading ? "Sending..." : "Send Notification"}
            </button>
            {loading && job && (
              <button onClick={handleCancel} className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                <FiStopCircle size={18} /> Cancel
              </button>
            )}
          </div>
        </div>

        {/* Progress Card */}
        {job && (
          <div className="mt-6 rounded-xl border-2 border-[#D2A100] p-6" style={{ backgroundColor: "#033503ff" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">
                {job.status === "running" ? "Sending in Progress..." : job.status === "done" ? "Completed" : "Cancelled"}
              </h2>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                job.status === "running" ? "bg-yellow-500/20 text-yellow-400" :
                job.status === "done" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}>{job.status === "running" ? "Running" : job.status === "done" ? "Done" : "Cancelled"}</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>{job.processed.toLocaleString()} / {job.total.toLocaleString()} processed</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full rounded-full h-3" style={{ backgroundColor: "#110E05" }}>
                <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: job.status === "done" ? "#22c55e" : job.status === "cancelled" ? "#ef4444" : "#D2A100" }} />
              </div>
              {estMinutes !== null && estMinutes > 0 && <p className="text-xs text-gray-500 mt-1">~{estMinutes} min remaining</p>}
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="rounded-lg p-3" style={{ backgroundColor: "#110E05" }}>
                <p className="text-xl font-bold text-white">{job.total.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">Total</p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "#110E05" }}>
                <p className="text-xl font-bold text-green-400">{job.sent.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">Delivered</p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "#110E05" }}>
                <p className="text-xl font-bold text-red-400">{job.failed.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">Failed</p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "#110E05" }}>
                <p className="text-xl font-bold text-yellow-400">{(job.total - job.processed).toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">Pending</p>
              </div>
            </div>
          </div>
        )}

        {/* Notification History Table */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Notification History</h2>
            <button onClick={() => fetchHistory()} className="text-[#D2A100] hover:text-yellow-400 transition-colors">
              <FiRefreshCw size={20} />
            </button>
          </div>

          <div className="rounded-xl border-2 border-[#D2A100] overflow-hidden" style={{ backgroundColor: "#033503ff" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-[#D2A100]/30" style={{ backgroundColor: "#110E05" }}>
                    <th className="px-4 py-3 text-[#D2A100] font-semibold">Job ID</th>
                    <th className="px-4 py-3 text-[#D2A100] font-semibold">Message</th>
                    <th className="px-4 py-3 text-[#D2A100] font-semibold">Target</th>
                    <th className="px-4 py-3 text-[#D2A100] font-semibold">Sent</th>
                    <th className="px-4 py-3 text-[#D2A100] font-semibold">Failed</th>
                    <th className="px-4 py-3 text-[#D2A100] font-semibold">Pending</th>
                    <th className="px-4 py-3 text-[#D2A100] font-semibold">Status</th>
                    <th className="px-4 py-3 text-[#D2A100] font-semibold">Date</th>
                    <th className="px-4 py-3 text-[#D2A100] font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">No notification jobs yet</td></tr>
                  ) : (
                    history.map((h) => (
                      <tr key={h.id} className="border-b border-[#D2A100]/10 hover:bg-[#110E05]/50 transition-colors">
                        <td className="px-4 py-3 text-white font-mono text-xs">{h.jobId.slice(0, 16)}...</td>
                        <td className="px-4 py-3 text-gray-300 max-w-[200px] truncate">{h.message}</td>
                        <td className="px-4 py-3 text-gray-300 capitalize">{targetLabel[h.target] || h.target}</td>
                        <td className="px-4 py-3 text-green-400 font-semibold">{h.sent}</td>
                        <td className="px-4 py-3 text-red-400 font-semibold">{h.failed}</td>
                        <td className="px-4 py-3 text-yellow-400 font-semibold">{Math.max(0, h.total - h.sent - h.failed)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            h.status === "running" ? "bg-yellow-500/20 text-yellow-400" :
                            h.status === "done" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                          }`}>{h.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{new Date(h.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => viewJobDetail(h.jobId)}
                            className="text-[#D2A100] hover:text-yellow-400 transition-colors"
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {historyTotal > historyLimit && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#D2A100]/30" style={{ backgroundColor: "#110E05" }}>
                <p className="text-sm text-gray-400">
                  Showing {((historyPage - 1) * historyLimit) + 1}-{Math.min(historyPage * historyLimit, historyTotal)} of {historyTotal}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { const p = historyPage - 1; setHistoryPage(p); fetchHistory(p); }}
                    disabled={historyPage <= 1}
                    className="px-3 py-1 rounded border border-[#D2A100] text-[#D2A100] text-sm font-semibold disabled:opacity-30 hover:bg-[#D2A100] hover:text-black transition-colors"
                  >
                    Prev
                  </button>
                  <span className="px-3 py-1 text-white text-sm">{historyPage} / {Math.ceil(historyTotal / historyLimit)}</span>
                  <button
                    onClick={() => { const p = historyPage + 1; setHistoryPage(p); fetchHistory(p); }}
                    disabled={historyPage >= Math.ceil(historyTotal / historyLimit)}
                    className="px-3 py-1 rounded border border-[#D2A100] text-[#D2A100] text-sm font-semibold disabled:opacity-30 hover:bg-[#D2A100] hover:text-black transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Detail Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedJob(null)}>
            <div className="rounded-xl border-2 border-[#D2A100] p-6 max-w-lg w-full" style={{ backgroundColor: "#033503ff" }} onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-bold text-white mb-4">Job Details</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Job ID:</span>
                  <span className="text-white font-mono text-xs">{selectedJob.jobId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Target:</span>
                  <span className="text-white capitalize">{targetLabel[selectedJob.target] || selectedJob.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-semibold ${selectedJob.status === "done" ? "text-green-400" : selectedJob.status === "running" ? "text-yellow-400" : "text-red-400"}`}>
                    {selectedJob.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">{new Date(selectedJob.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Message:</span>
                  <div className="rounded-lg px-3 py-2 text-white text-sm border border-[#D2A100]/30" style={{ backgroundColor: "#110E05" }}>
                    {selectedJob.message}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 text-center mb-6">
                <div className="rounded-lg p-3" style={{ backgroundColor: "#110E05" }}>
                  <p className="text-xl font-bold text-white">{selectedJob.total}</p>
                  <p className="text-xs text-gray-400">Total</p>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: "#110E05" }}>
                  <p className="text-xl font-bold text-green-400">{selectedJob.sent}</p>
                  <p className="text-xs text-gray-400">Delivered</p>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: "#110E05" }}>
                  <p className="text-xl font-bold text-red-400">{selectedJob.failed}</p>
                  <p className="text-xs text-gray-400">Failed</p>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: "#110E05" }}>
                  <p className="text-xl font-bold text-yellow-400">{Math.max(0, selectedJob.total - selectedJob.sent - selectedJob.failed)}</p>
                  <p className="text-xs text-gray-400">Pending</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedJob.canResend && selectedJob.failed > 0 && (
                  <button
                    onClick={() => handleResend(selectedJob.jobId)}
                    disabled={resending}
                    className={BTN}
                  >
                    <FiRefreshCw size={16} />
                    {resending ? "Resending..." : `Resend to ${selectedJob.failed} Failed Users`}
                  </button>
                )}
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-5 py-3 rounded-lg font-semibold border-2 border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
