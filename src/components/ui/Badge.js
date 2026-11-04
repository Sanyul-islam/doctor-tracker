import React from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    sky: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    teal: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Active: { variant: "sky", label: "Active" },
    "In Treatment": { variant: "amber", label: "In Treatment" },
    Recovered: { variant: "emerald", label: "Recovered" },
    Critical: { variant: "rose", label: "Critical" },
  };

  const config = map[status] || { variant: "default", label: status || "Unknown" };

  return (
    <Badge variant={config.variant}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        config.variant === "emerald" && "bg-emerald-500",
        config.variant === "amber" && "bg-amber-500",
        config.variant === "rose" && "bg-rose-500 animate-pulse",
        config.variant === "sky" && "bg-sky-500",
        config.variant === "default" && "bg-slate-400"
      )} />
      {config.label}
    </Badge>
  );
}

export function SpecialtyBadge({ specialty }) {
  const map = {
    Cardiology: "rose",
    Neurology: "purple",
    Pediatrics: "teal",
    Orthopedics: "indigo",
    Oncology: "amber",
    Dermatology: "sky",
    "General Medicine": "emerald",
  };

  const variant = map[specialty] || "indigo";

  return <Badge variant={variant}>{specialty}</Badge>;
}

