"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import { toast } from "react-hot-toast";

const BTN =
  "flex items-center gap-2 px-3 py-2 rounded-lg font-semibold border-2 transition-all border-[#D2A100] bg-gradient-to-br from-[#110E05] to-[#362A02] text-[#737157] hover:border-yellow-500 hover:text-white";

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleString() : "-");

export default function AdminBoosterService() {
  const [list, setList] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupLink, setGroupLink] = useState("");
  const [subscriptionid, setSubscriptionid] = useState("");
  const [status, setStatus] = useState(true);
  const [isSubmit, setisSubmit] = useState(false);

  const [txHash, setTxHash] = useState("");
  const [price, setprice] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [username, setUsername] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const loadData = async () => {
    const res = await axiosInstance.get("/admin/booster-services");
    if (res.data.success) setList(res.data.data);

    const s = await axiosInstance.get("/admin/subscriptions");
    setSubs(s.data.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setGroupName("");
    setGroupLink("");
    setSubscriptionid("");
    setGroupId("");
    setStatus(true);

    setTxHash("");
    setWalletAddress("");
    setUsername("");
    setCreatedAt("");

    setOpen(true);
  };

  const openEdit = (b: any) => {
    setEditId(b.id);
    setGroupName(b.groupName ?? "");
    setGroupLink(b.groupLink ?? "");
    setSubscriptionid(String(b.subscriptionid ?? ""));
    setStatus(Boolean(b.status));
    setGroupId(String(b.groupId ?? ""));

    setTxHash(b.txHash ?? "");
    setWalletAddress(b.walletAddress ?? "");
    setUsername(b.username ?? "");
    setCreatedAt(b.createdAt ?? "");
    setprice(b.price ?? "")

    setOpen(true);
  };

  const save = async () => {
    if (!groupName || !groupLink || !subscriptionid) {
      toast.error("All fields required");
      return;
    }

    try {
      setisSubmit(true);

      const payload = {
        groupName,
        groupLink,
        subscriptionid,
        status,
        groupId,
      };

      if (editId) {
        await axiosInstance.post(`/admin/update-booster-services`, {
          ...payload,
          id: editId,
        });
      } else {
        await axiosInstance.post("/admin/add-booster-services", payload);
      }

      toast.success("Saved");
      setOpen(false);
      loadData();
    } catch {
      toast.error("Save failed");
    } finally {
      setisSubmit(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-md shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Booster Services</h2>
        <button className={BTN} onClick={openAdd}>
          + Add Booster
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Username</th>
            <th className="border p-2">Group Name</th>
            <th className="border p-2">Group Id</th>
            <th className="border p-2">Link</th>
            <th className="border p-2">Wallet</th>
            <th className="border p-2">Tx Hash</th>
            <th className="border p-2">Paid</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {list.map((b) => (
            <tr key={b.id}>
              <td className="border p-2">{b.username ?? "-"}</td>
              <td className="border p-2">{b.groupName ?? "-"}</td>
              <td className="border p-2">{b.groupId ?? "-"}</td>

              <td className="border p-2">
                {b.groupLink ? (
                  <a
                    className="text-blue-700 underline"
                    href={b.groupLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                ) : (
                  "-"
                )}
              </td>

              <td className="border p-2">
                {b.walletAddress ? (
                  <span className="text-xs break-all">{b.walletAddress}</span>
                ) : (
                  "-"
                )}
              </td>

              <td className="border p-2">
                {b.txHash ? (
                  <span className="text-xs break-all">{b.txHash}</span>
                ) : (
                  "-"
                )}
              </td>

              <td className="border p-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    b.txHash
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {b.txHash ? "Paid" : "Unpaid"}
                </span>
              </td>

              <td className="border p-2">{fmtDate(b.createdAt)}</td>

              <td className="border p-2">
                {b.status ? "Active" : "InActive"}
              </td>

              <td className="border p-2">
                <button className={BTN} onClick={() => openEdit(b)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}

          {list.length === 0 && (
            <tr>
              <td className="border p-4 text-center text-gray-500" colSpan={11}>
                No booster services found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-3">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="font-bold mb-4">
              {editId ? "Edit Booster" : "Add Booster"}
            </h3>

            {editId && (
              <div className="border rounded p-3 mb-4 bg-gray-50">
                <div className="text-sm font-bold mb-2">Payment Details</div>

                <div className="text-xs text-gray-600 mb-1">
                  Username:{" "}
                  <span className="font-semibold text-gray-800">
                    {username || "-"}
                  </span>
                </div>

                <div className="text-xs text-gray-600 mb-1">
                  Wallet:{" "}
                  <span className="font-semibold text-gray-800 break-all">
                    {walletAddress || "-"}
                  </span>
                </div>

                <div className="text-xs text-gray-600 mb-1">
                  Tx Hash:{" "}
                  <span className="font-semibold text-gray-800 break-all">
                    {txHash || "-"}
                  </span>
                </div>

                <div className="text-xs text-gray-600 mb-1">
                  Price:{" "}
                  <span className="font-semibold text-gray-800 break-all">
                    {price || "0"} USDC
                  </span>
                </div>

                <div className="text-xs text-gray-600">
                  Created:{" "}
                  <span className="font-semibold text-gray-800">
                    {createdAt ? new Date(createdAt).toLocaleString() : "-"}
                  </span>
                </div>
              </div>
            )}

            <input
              className="border p-2 w-full mb-3"
              placeholder="Telegram Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            <input
              className="border p-2 w-full mb-3"
              placeholder="Telegram Group Id"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            />

            <input
              className="border p-2 w-full mb-3"
              placeholder="Telegram Group Link"
              value={groupLink}
              onChange={(e) => setGroupLink(e.target.value)}
            />

            <select
              className="border p-2 w-full mb-3"
              value={subscriptionid}
              onChange={(e) => setSubscriptionid(e.target.value)}
            >
              <option value="">Select Subscription</option>
              {subs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.totaldays} {s.durationType} – {s.price} USDC
                </option>
              ))}
            </select>

            <div className="flex gap-4 mb-4">
              <label>
                <input
                  type="radio"
                  checked={status}
                  onChange={() => setStatus(true)}
                />{" "}
                Active
              </label>
              <label>
                <input
                  type="radio"
                  checked={!status}
                  onChange={() => setStatus(false)}
                />{" "}
                Inactive
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button className={BTN} onClick={save} disabled={isSubmit}>
                {isSubmit ? "Processing" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
