"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { authenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.replace(authenticated ? "/dashboard" : "/login");
  }, [authenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <p className="text-gray-700 dark:text-gray-300">Redirecting...</p>
    </div>
  );
}
