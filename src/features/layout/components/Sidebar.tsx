"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/shared/lib/supabase";
import { User, X, QrCode } from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? "Unknown");
    };

    getUser();
  }, []);

  const menu = [
    { name: "Dashboard", href: "/admin" },
    { name: "Product", href: "/admin/product" },
    { name: "QR Management", href: "/admin/qr" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <>
      {/* Overlay Gelap untuk Mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r flex flex-col transition-transform duration-300 ease-in-out
          md:static md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo & Close Button */}
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Menu */}
        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`px-4 py-2 rounded-md transition ${pathname === item.href
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
                }`}
            >
              {item.name}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="mt-2 text-red-600 px-4 py-2 rounded-md hover:bg-red-50 text-left"
          >
            Logout
          </button>
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-gray-600" />
            </div>

            <p className="text-sm font-medium truncate">
              {userEmail ?? "Loading..."}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
