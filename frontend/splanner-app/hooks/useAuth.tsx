"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface AuthContextType {
  authenticated: boolean;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      setAccessToken(token);
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.post("auth/login/", { username, password });
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    setAccessToken(res.data.access);
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAccessToken(null);
    setAuthenticated(false);
    router.push("/login");
  };

  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
      logout();
      return null;
    }

    try {
      const res = await api.post("auth/refresh/", { refresh });
      localStorage.setItem("access", res.data.access);
      setAccessToken(res.data.access);
      setAuthenticated(true);
      return res.data.access;
    } catch (err) {
      logout();
      return null;
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ authenticated, accessToken, login, logout, refreshToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
