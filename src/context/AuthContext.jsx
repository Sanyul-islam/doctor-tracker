"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // Restore authentication from Backend cookie
  const checkAuth = useCallback(async () => {
    try {
      const res = await api.getMe();

      if (res.success && res.admin) {
        setUser(res.admin);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Route protection
  useEffect(() => {
    if (isLoading) return;

    const isLoginPage = pathname === "/login";

    if (!user && !isLoginPage) {
      router.replace("/login");
    } else if (user && isLoginPage) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, pathname, router]);

  // Login
  const login = useCallback(async (email, password) => {
    const res = await api.login({ email, password });

    if (res.success && res.admin) {
      setUser(res.admin);
      return { success: true };
    }

    throw new Error(res.message || "Invalid credentials");
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
      router.replace("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
