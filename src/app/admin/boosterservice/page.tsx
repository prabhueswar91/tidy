"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import { toast } from "react-hot-toast";

const BTN =
  "flex items-center gap-2 px-3 py-2 rounded-lg font-semibold border-2 transition-all border-[#D2A100] bg-gradient-to-br from-[#110E05] to-[#362A02] text-[#737157] hover:border-yellow-500 hover:text-white";

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
    setOpen(true);
  };

  const openEdit = (b: any) => {
    setEditId(b.id);
    setGroupName(b.groupName);
    setGroupLink(b.groupLink);
    setSubscriptionid(b.subscriptionid);
    setStatus(b.status);
    setOpen(true);
  };

  const save = async () => {
    if (!groupName || !groupLink || !subscriptionid) {
      toast.error("All fields required");
      return;
    }

    try {
      setisSubmit(true)
      if (editId) {
        await axiosInstance.post(`/admin/update-booster-services`, {
          groupName,
          groupLink,
          subscriptionid,
          status,
          id:editId,
          groupId
        });
      } else {
        await axiosInstance.post("/admin/add-booster-services", {
          groupName,
          groupLink,
          subscriptionid,
          status,
          groupId
        });
      }

      toast.success("Saved");
      setOpen(false);
      loadData();
    } catch {
      toast.error("Save failed");
    }finally{
       setisSubmit(false)
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

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Group Name</th>
            <th className="border p-2">Group Id</th>
            <th className="border p-2">Link</th>
            <th className="border p-2">Subscription</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((b) => (
            <tr key={b.id}>
              <td className="border p-2">{b.groupName}</td>
              <td className="border p-2">{b.groupId}</td>
              <td className="border p-2">{b.groupLink}</td>
              <td className="border p-2">{b.totaldays} days</td>
              <td className="border p-2">
                {b.status ? "Active" : "Inactive"}
              </td>
              <td className="border p-2">
                <button className={BTN} onClick={() => openEdit(b)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-bold mb-4">
              {editId ? "Edit Booster" : "Add Booster"}
            </h3>

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
                  {s.totaldays} days – {s.price} USDC
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
                {isSubmit?"Processing":"Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
