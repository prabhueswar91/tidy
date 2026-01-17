"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

type SubType = "days" | "weeks" | "months";

interface Sub {
  id: number;
  totaldays: number; // keeping your existing field name from backend
  price: number;
  durationType?: SubType; // add this if backend returns it; safe as optional
}

const BTN =
  "flex items-center gap-3 px-3 py-3 rounded-lg font-semibold border-2 transition-all duration-300 border-[#D2A100] bg-gradient-to-br from-[#110E05] to-[#362A02] text-[#737157] hover:border-yellow-500 hover:from-[#362A02] hover:to-[#110E05] hover:text-white";

export default function AdminSubscriptions() {
  const [list, setList] = useState<Sub[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [type, setType] = useState<SubType>("days"); // NEW
  const [totalValue, setTotalValue] = useState(""); // renamed from totaldays for UI clarity
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
    setType("days");
    setTotalValue("");
    setPrice("");
    setOpen(true);
  };

  const openEdit = (s: Sub) => {
    setEditId(s.id);
    setType((s.durationType as SubType) || "days");
    setTotalValue(String(s.totaldays));
    setPrice(String(s.price));
    setOpen(true);
  };

  const totalPlaceholder =
    type === "days"
      ? "Total Days"
      : type === "weeks"
      ? "Total Weeks"
      : "Total Months";

  const save = async () => {
    const total = totalValue.trim();
    const amount = price.trim();

    if (!total || !amount) {
      toast.error(`${totalPlaceholder} and price are required`);
      return;
    }

    if (!/^\d+$/.test(total)) {
      toast.error(`${totalPlaceholder} must be a whole number`);
      return;
    }

    if (!/^\d+(\.\d+)?$/.test(amount)) {
      toast.error("Price must be a valid number");
      return;
    }

    const totalNum = Number(total);
    const priceNum = Number(amount);

    if (totalNum <= 0) {
      toast.error(`${totalPlaceholder} must be greater than 0`);
      return;
    }

    if (priceNum <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    try {
      setisSubmit(true);

      const payload = {
        totaldays: totalNum, // keep backend param name as-is
        price: priceNum,
        type,
      };

      if (editId) {
        await axiosInstance.post(`/admin/update-subscriptions`, {
          id: editId,
          ...payload,
        });
      } else {
        await axiosInstance.post("/admin/add-subscriptions", payload);
      }

      toast.success(editId ? "Updated successfully" : "Saved successfully");
      setOpen(false);
      fetchData();
    } catch {
      toast.error("Save failed");
    } finally {
      setisSubmit(false);
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
            <th className="border px-3 py-2">Type</th>
            <th className="border px-3 py-2">Total</th>
            <th className="border px-3 py-2">Price</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((s) => (
            <tr key={s.id}>
              <td className="border px-3 py-2 capitalize">{s.durationType ?? "days"}</td>
              <td className="border px-3 py-2">{s.totaldays}</td>
              <td className="border px-3 py-2">{s.price} USDC</td>
              <td className="border px-3 py-2">
                <div className="flex gap-4">
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
                </div>
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

            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="subType"
                  checked={type === "days"}
                  onChange={() => setType("days")}
                />
                Days
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="subType"
                  checked={type === "weeks"}
                  onChange={() => setType("weeks")}
                />
                Weeks
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="subType"
                  checked={type === "months"}
                  onChange={() => setType("months")}
                />
                Months
              </label>
            </div>

            <input
              placeholder={totalPlaceholder}
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              placeholder="Price(USDC)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            />

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
