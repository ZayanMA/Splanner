"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  authenticated: boolean;
  setAuthenticated: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setAuthenticated(!!token);
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth(required = false) {
  const context = useContext(AuthContext);
  const router = useRouter();

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { authenticated, setAuthenticated } = context;

  useEffect(() => {
    const token = localStorage.getItem("access");
    setAuthenticated(!!token);

    if (required && !token) {
      router.push("/login");
    }
  }, [required, router, setAuthenticated]);

  return { authenticated, setAuthenticated };
}