"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, Shield, ChevronDown } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { getApiMode } from "@/lib/api";

export function Header({ onOpenSidebar, pageTitle = "Portal" }) {
  const { user, logout } = useAuth();

  // Dropdown states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Refs
  const notificationRef = useRef(null);
  const menuRef = useRef(null);

  // API mode
  const apiMode = getApiMode();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }

      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-sky-100 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-[0_2px_15px_rgba(186,230,253,0.15)]">
      {/* Left: Sidebar & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition-colors"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {pageTitle}
          </h1>

          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 shadow-xs">
            <Shield className="w-3 h-3 text-sky-500" />
            Clinical Admin
          </span>
        </div>
      </div>

      {/* Right: API Mode, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* API Mode Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-sky-50/70 border-sky-200 text-sky-800 shadow-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              apiMode === "real" ? "bg-emerald-500 animate-pulse" : "bg-sky-500"
            }`}
          />

          <span className="text-[11px]">
            Mode:{" "}
            <strong className="font-bold">
              {apiMode === "real" ? "Express REST" : "Standalone Seed"}
            </strong>
          </span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-sky-700 hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-colors relative"
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell className="w-5 h-5" />

            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-xl border border-sky-100 rounded-2xl shadow-xl shadow-sky-900/10 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100 mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Clinical System Alerts
                </h4>

                <span className="text-[10px] text-sky-700 font-bold bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200">
                  3 New
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100">
                  <p className="text-xs font-semibold text-slate-900">
                    New Critical Patient Admitted
                  </p>

                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Nathaniel Cole assigned to Dr. David Alvarez (ICU).
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100">
                  <p className="text-xs font-semibold text-slate-900">
                    Doctor Roster Synchronized
                  </p>

                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Dr. William Zhao added to City Care Clinic.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100">
                  <p className="text-xs font-semibold text-slate-900">
                    High Occupancy in Cardiology
                  </p>

                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Metro General has 8 active cardiovascular cases.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              setShowProfileMenu((prev) => !prev);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-colors"
            aria-expanded={showProfileMenu}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-sky-500/20">
              {user?.avatar || "AD"}
            </div>

            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-slate-900 leading-tight">
                {user?.name || "Dr. Evelyn Reed"}
              </span>

              <span className="block text-[10px] text-sky-700 font-medium">
                {user?.role || "System Administrator"}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl border border-sky-100 rounded-2xl shadow-xl shadow-sky-900/10 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 border-b border-sky-100 mb-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || "Dr. Evelyn Reed"}
                </p>

                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email || "admin@doctortracker.com"}
                </p>
              </div>

              <div className="p-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}