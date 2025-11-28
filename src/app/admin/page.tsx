"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/shared/lib/supabase";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (session) {
            // Sudah login, redirect ke dashboard
            router.push("/admin/dashboard");
        } else {
            // Belum login, redirect ke login page
            router.push("/admin/login");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Checking authentication...</p>
            </div>
        </div>
    );
}
