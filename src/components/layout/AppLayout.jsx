"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Activity } from "lucide-react";

export function AppLayout({ children, title = "Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-100 text-slate-700">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/25 mb-4 animate-pulse">
          <Activity className="w-7 h-7" />
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-sky-800">
          <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
          <span>Synchronizing Doctor Tracker Portal...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900 selection:bg-sky-200 selection:text-sky-900 relative">
      {/* Soft ambient gradient orbs */}
      <div className="fixed top-0 left-0 w-[550px] h-[550px] bg-sky-200/35 rounded-full blur-3xl pointer-events-none -z-10 -translate-x-1/3 -translate-y-1/3" />
      <div className="fixed top-1/3 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10 translate-x-1/3" />
      <div className="fixed bottom-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col flex-1">
        <Header onOpenSidebar={() => setSidebarOpen(true)} pageTitle={title} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
