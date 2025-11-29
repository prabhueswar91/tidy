"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiUsers, FiLayers, FiMenu } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setCollapsed(true);
      else setCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <FiHome size={20} />,
    },
    { label: "Users", href: "/admin/users", icon: <FiUsers size={20} /> },
    { label: "Partner", href: "/admin/partner", icon: <FiLayers size={20} /> },
  ];

  return (
    <aside
      className={`transition-all duration-300 shadow-md relative
        ${
          isMobile
            ? "absolute z-50 top-0 left-0 h-screen"
            : "h-full flex-shrink-0"
        }
        ${collapsed ? "w-16" : "w-60"}
      `}
      style={{ backgroundColor: "#033503ff" }}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-200 p-2 rounded-md hover:bg-gray-700 transition"
        >
          <FiMenu size={24} />
        </button>
      </div>

      <div className="mt-4">
        <nav className="flex flex-col space-y-3 px-2">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg font-semibold border-2 transition-all duration-300
                  ${
                    isActive
                      ? "border-yellow-500 bg-gradient-to-br from-[#362A02] to-[#110E05] text-white"
                      : "border-[#D2A100] bg-gradient-to-br from-[#110E05] to-[#362A02] text-[#737157] hover:border-yellow-500 hover:from-[#362A02] hover:to-[#110E05] hover:text-white"
                  }
                `}
              >
                <span className="flex-shrink-0">{link.icon}</span>
                {!collapsed && (
                  <span className="transition-colors duration-300">
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
