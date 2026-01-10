"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Sub {
  id: number;
  totaldays: number;
  price: number;
}
const BTN =
  "flex items-center gap-3 px-3 py-3 rounded-lg font-semibold border-2 transition-all duration-300 border-[#D2A100] bg-gradient-to-br from-[#110E05] to-[#362A02] text-[#737157] hover:border-yellow-500 hover:from-[#362A02] hover:to-[#110E05] hover:text-white";

export default function AdminSubscriptions() {
  const [list, setList] = useState<Sub[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [totaldays, setTotaldays] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmit, setisSubmit] = useState(false);

  const fetchData = async () => {
    const res = await axiosInstance.get("/admin/subscriptions");
    if (res.data.success) setList(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setTotaldays("");
    setPrice("");
    setOpen(true);
  };

  const openEdit = (s: Sub) => {
    setEditId(s.id);
    setTotaldays(String(s.totaldays));
    setPrice(String(s.price));
    setOpen(true);
  };

    const save = async () => {
        const days = totaldays.trim();
        const amount = price.trim();

        if (!days || !amount) {
            toast.error("Total days and price are required");
            return;
        }

        if (!/^\d+$/.test(days)) {
            toast.error("Total days must be a whole number");
            return;
        }

        if (!/^\d+(\.\d+)?$/.test(amount)) {
            toast.error("Price must be a valid number");
            return;
        }

        const totalDaysNum = Number(days);
        const priceNum = Number(amount);

        if (totalDaysNum <= 0) {
            toast.error("Total days must be greater than 0");
            return;
        }

        if (priceNum <= 0) {
            toast.error("Price must be greater than 0");
            return;
        }

        try {
        setisSubmit(true)
        if (editId) {
            await axiosInstance.post(`/admin/update-subscriptions`, {
                id: editId,
                totaldays: totalDaysNum,
                price: priceNum,
            });
        } else {
            await axiosInstance.post("/admin/add-subscriptions", {
                totaldays: totalDaysNum,
                price: priceNum,
            });
        }

        toast.success(editId?"Updated successfully":"Saved successfully");
        setOpen(false);
        fetchData();
        } catch {
            toast.error("Save failed");
        }finally{
            setisSubmit(false)
        }
    };

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;
    await axiosInstance.delete(`/admin/delete-subscriptions/${id}`);
    toast.success("Deleted");
    fetchData();
  };

  return (
    <div className="p-6 bg-gray-50 rounded-md shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Subscriptions</h2>
        <button className={BTN} onClick={openAdd}>
          + Add Subscription
        </button>
      </div>

      <table className="min-w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-3 py-2">Total Days</th>
            <th className="border px-3 py-2">Price</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((s) => (
            <tr key={s.id}>
              <td className="border px-3 py-2">{s.totaldays}</td>
              <td className="border px-3 py-2">{s.price}</td>
             <td className="border px-3 py-2 flex gap-4">
                <button
                    onClick={() => openEdit(s)}
                    className="flex items-center gap-1 text-green-600 font-semibold hover:text-green-800"
                >
                    <FaEdit /> Edit
                </button>

                <button
                    onClick={() => remove(s.id)}
                    className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-800"
                >
                    <FaTrash /> Delete
                </button>
                </td>

            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">
              {editId ? "Edit Subscription" : "Add Subscription"}
            </h3>

            <input
              placeholder="Total Days"
              value={totaldays}
              onChange={(e) => setTotaldays(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            />

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
