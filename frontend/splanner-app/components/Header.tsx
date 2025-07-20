"use client";
import Link from "next/link";
import { useLogout } from "@/hooks/useLogout";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const logout = useLogout();
  const { authenticated } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 shadow">
      <nav className="flex space-x-6">
        {authenticated && (
          <>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/tasks" className="hover:underline">Tasks</Link>
            <Link href="/courses" className="hover:underline">Courses</Link>
            <Link href="/notes" className="hover:underline">Notes</Link>
          </>
        )}
      </nav>
    {authenticated && (
      <button
        onClick={logout}
        className="text-red-600 hover:underline"
        aria-label="Logout"
      >
        Logout
      </button>
    )}
    </header>
  );
}
