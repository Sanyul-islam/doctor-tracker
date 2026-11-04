import React from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = "neutral", // "up" | "down" | "neutral" | "urgent"
  color = "indigo", // "indigo" | "emerald" | "amber" | "rose" | "sky"
  className,
}) {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50",
      accent: "from-indigo-500/10 to-indigo-500/0",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
      accent: "from-emerald-500/10 to-emerald-500/0",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
      accent: "from-amber-500/10 to-amber-500/0",
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50",
      accent: "from-rose-500/10 to-rose-500/0",
    },
    sky: {
      bg: "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-900/50",
      accent: "from-sky-500/10 to-sky-500/0",
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          color === "indigo" && "from-indigo-500 to-indigo-600",
          color === "emerald" && "from-emerald-500 to-emerald-600",
          color === "amber" && "from-amber-500 to-amber-600",
          color === "rose" && "from-rose-500 to-rose-600",
          color === "sky" && "from-sky-500 to-sky-600"
        )}
      />

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={cn("p-2.5 rounded-xl border", scheme.bg)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-3 mb-1">
        <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center",
              trendType === "up" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
              trendType === "down" && "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
              trendType === "urgent" && "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 animate-pulse",
              trendType === "neutral" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

