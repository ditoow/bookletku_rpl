"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "lucide-react";

export default function AdminSidebar() {
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
    { name: "Dashboard", href: "/admin/pages/dashboard" },
    { name: "Product", href: "/admin/pages/product" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-64 h-screen border-r flex flex-col bg-white">
      {/* Logo */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 flex flex-col gap-1 p-4">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-md transition ${
              pathname === item.href
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
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>

          <p className="text-sm font-medium">{userEmail ?? "Loading..."}</p>
        </div>
      </div>
    </aside>
  );
}
