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
  RefreshCw,
  Server,
  Layers,
  X,
  Stethoscope,
  Sparkles,
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
  },
  {
    name: "Doctors",
    href: "/doctors",
    icon: UserCheck,
  },
  {
    name: "Patients",
    href: "/patients",
    icon: Users,
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
        : "Switched to Standalone Mock / LocalStorage mode",
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
          className="fixed inset-0 z-40 bg-sky-950/30 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-white/90 backdrop-blur-xl text-slate-700 border-r border-sky-100 shadow-[4px_0_30px_rgba(186,230,253,0.22)] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo / Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-sky-100/80 bg-gradient-to-r from-white via-sky-50/50 to-white shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-all">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                Doctor<span className="text-sky-600">Tracker</span>
              </span>
              <span className="block text-[10px] text-sky-700 font-semibold tracking-wider uppercase">
                Clinical Console
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-sky-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-sky-700/80 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-sky-500" />
            Management Portal
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
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                  isActive
                    ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25"
                    : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform group-hover:scale-110",
                      isActive ? "text-white" : "text-sky-600"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-sky-100 bg-gradient-to-b from-white to-sky-50/40 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-md shadow-sky-500/20">
                {user?.avatar || "AD"}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || "Dr. Evelyn Reed"}
                </div>
                <div className="text-[10px] text-sky-700 font-medium truncate">
                  {user?.email || "admin@doctortracker.com"}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
