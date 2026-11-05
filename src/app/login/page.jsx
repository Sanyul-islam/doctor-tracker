"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Activity,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please provide both email and password.");
      return;
    }

    try {
      setIsLoading(true);

      await login(email.trim(), password);

      toast.success("Welcome back to Doctor Tracker!");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
      toast.error(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Left Column */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 border-r border-slate-800 bg-slate-900/40 backdrop-blur-md relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Activity className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Doctor<span className="text-indigo-400">Tracker</span>
              </span>
              <span className="block text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                Clinical Administration System
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Healthcare Management</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Streamlined doctor rosters and synchronized patient intelligence.
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            High-performance administrative suite providing real-time doctor
            caseload tracking, specialized patient assignment, and data
            visualization across medical departments.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="space-y-1">
              <span className="text-xl font-bold text-white">100%</span>
              <p className="text-xs text-slate-400">RESTful Architecture</p>
            </div>

            <div className="space-y-1">
              <span className="text-xl font-bold text-white">&lt; 100ms</span>
              <p className="text-xs text-slate-400">Optimized Client Queries</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            Role-Based Access Control • HIPAA & Administrative Standards
          </span>
        </div>
      </div>

      {/* Right Column: Login Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-500/30">
              <Activity className="w-7 h-7" />
            </div>

            <h1 className="text-2xl font-bold text-white">DoctorTracker</h1>

            <p className="text-xs text-slate-400 mt-1">
              Clinical Administration Portal
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Sign In to Your Portal
            </h2>

            <p className="text-sm text-slate-400 mt-1.5">
              Enter authorized administrator credentials to manage records.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 text-rose-300 text-xs border border-rose-800 animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />

                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />

                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Access Clinical Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
