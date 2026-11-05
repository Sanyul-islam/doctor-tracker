import React from "react";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";
import { UserPlus, ArrowUpRight, ShieldCheck, HeartPulse } from "lucide-react";
import Link from "next/link";

export function ActivityFeed({ recentPatients = [] }) {
  return (
    <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Recent Patient Admissions
            </h3>
            <p className="text-xs text-slate-500">
              Latest patient intakes logged into the portal
            </p>
          </div>
          <Link
            href="/patients"
            className="text-xs font-semibold text-sky-600 hover:text-sky-800 hover:underline flex items-center gap-1"
          >
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentPatients.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No recent admissions.
            </p>
          ) : (
            recentPatients.map((patient) => (
              <div
                key={patient._id || patient.id}
                className="flex items-center justify-between p-3 rounded-xl bg-sky-50/70 border border-sky-100 hover:border-sky-200 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0 border border-sky-200">
                    {patient.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {patient.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {patient.condition} • {patient.age} yrs
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={patient.status} />
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    {formatDate(patient.admissionDate || patient.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-sky-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
          <HeartPulse className="w-4 h-4" />
          Patient Registry Operational
        </span>
        <span className="text-slate-400">Auto-sync enabled</span>
      </div>
    </div>
  );
}

