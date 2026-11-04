"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  Users,
  Activity,
  LogOut,
  Database,
  RefreshCw,
  Server,
  Layers,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getApiMode, setApiMode, api } from "@/lib/api";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Doctors",
    href: "/doctors",
    icon: UserCheck,
    badge: null,
  },
  {
    name: "Patients",
    href: "/patients",
    icon: Users,
    badge: null,
  },
];

export function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const toast = useToast();
  const [apiMode, setMode] = useState("mock");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    setMode(getApiMode());
  }, []);

  const handleToggleMode = () => {
    const nextMode = apiMode === "mock" ? "real" : "mock";
    setApiMode(nextMode);
    setMode(nextMode);
    toast.info(
      nextMode === "real"
        ? "Switched to Express REST API mode (http://localhost:5000/api)"
        : "Switched to Mock / LocalStorage standalone mode",
      "API Configuration Updated"
    );
  };

  const handleResetData = () => {
    setIsResetting(true);
    try {
      api.resetData();
      toast.success("Sample database re-seeded successfully!", "Data Reset");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch {
      toast.error("Failed to re-seed data.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo / Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Doctor<span className="text-indigo-400">Tracker</span>
              </span>
              <span className="block text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                Admin Console
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Core Portal
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform group-hover:scale-110",
                      isActive ? "text-white" : "text-slate-400"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Integration & Developer Tools */}
          <div className="pt-6 px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Backend & Mode
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                Data Source
              </span>
              <span
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider",
                  apiMode === "real"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : "bg-sky-950 text-sky-400 border border-sky-800"
                )}
              >
                {apiMode === "real" ? "Express REST" : "Standalone Demo"}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              {apiMode === "real"
                ? "Connecting to Express server at :5000 with MongoDB."
                : "Active with browser seed store (zero setup needed)."}
            </p>

            <button
              onClick={handleToggleMode}
              className="w-full text-xs py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <Layers className="w-3.5 h-3.5" />
              Switch to {apiMode === "mock" ? "Express REST" : "Mock Store"}
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={handleResetData}
              disabled={isResetting}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isResetting && "animate-spin")} />
              Reset Demo Data
            </button>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center justify-center text-xs shrink-0">
                {user?.avatar || "AD"}
              </div>
              <div className="truncate">
                <div className="text-sm font-semibold text-white truncate">
                  {user?.name || "Administrator"}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {user?.email || "admin@doctortracker.com"}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 border border-rose-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

