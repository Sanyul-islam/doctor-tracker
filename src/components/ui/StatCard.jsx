import React from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = "neutral", // "up" | "down" | "neutral" | "urgent"
  color = "sky", // "sky" | "indigo" | "emerald" | "amber" | "rose"
  className,
}) {
  const colorMap = {
    sky: {
      bg: "bg-sky-50 text-sky-600 border-sky-200",
      topBar: "from-sky-400 via-sky-500 to-blue-500",
      iconGlow: "shadow-sky-500/20",
    },
    indigo: {
      bg: "bg-indigo-50 text-indigo-600 border-indigo-200",
      topBar: "from-sky-500 via-indigo-500 to-purple-500",
      iconGlow: "shadow-indigo-500/20",
    },
    emerald: {
      bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
      topBar: "from-teal-400 via-emerald-500 to-green-500",
      iconGlow: "shadow-emerald-500/20",
    },
    amber: {
      bg: "bg-amber-50 text-amber-600 border-amber-200",
      topBar: "from-amber-400 via-amber-500 to-orange-500",
      iconGlow: "shadow-amber-500/20",
    },
    rose: {
      bg: "bg-rose-50 text-rose-600 border-rose-200",
      topBar: "from-rose-400 via-rose-500 to-red-500",
      iconGlow: "shadow-rose-500/20",
    },
  };

  const scheme = colorMap[color] || colorMap.sky;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-sky-100 p-6 shadow-[0_4px_22px_rgba(186,230,253,0.18)] hover:shadow-[0_8px_30px_rgba(186,230,253,0.3)] hover:-translate-y-0.5 transition-all duration-200",
        className
      )}
    >
      {/* Top Gradient Highlight Bar */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r",
          scheme.topBar
        )}
      />

      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={cn("p-2.5 rounded-xl border shadow-sm", scheme.bg, scheme.iconGlow)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-3 mb-1">
        <div className="text-3xl font-extrabold tracking-tight text-slate-900">
          {value}
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center border",
              trendType === "up" && "bg-emerald-50 text-emerald-700 border-emerald-200",
              trendType === "down" && "bg-rose-50 text-rose-700 border-rose-200",
              trendType === "urgent" && "bg-rose-100 text-rose-800 border-rose-300 animate-pulse",
              trendType === "neutral" && "bg-sky-50 text-sky-700 border-sky-200"
            )}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>
      )}
    </div>
  );
}
