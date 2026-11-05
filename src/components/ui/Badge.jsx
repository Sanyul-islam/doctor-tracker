import React from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-xs",
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
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          config.variant === "emerald" && "bg-emerald-500",
          config.variant === "amber" && "bg-amber-500",
          config.variant === "rose" && "bg-rose-500 animate-pulse",
          config.variant === "sky" && "bg-sky-500",
          config.variant === "default" && "bg-slate-400"
        )}
      />
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

  const variant = map[specialty] || "sky";

  return <Badge variant={variant}>{specialty}</Badge>;
}
