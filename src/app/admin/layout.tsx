"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/admin/login";

  if (hideLayout) return <>{children}</>;

  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
