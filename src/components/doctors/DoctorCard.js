import React from "react";
import { SpecialtyBadge } from "@/components/ui/Badge";
import { Building2, Mail, Phone, Users, Calendar, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function DoctorCard({ doctor, onViewPatients, onEdit, onDelete }) {
  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Top row: Avatar, Specialty badge, Menu */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-base shadow-sm">
              {doctor.name.replace("Dr. ", "").substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {doctor.name}
              </h3>
              <div className="mt-1">
                <SpecialtyBadge specialty={doctor.specialization} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(doctor)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Edit doctor"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(doctor)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Delete doctor"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Rows */}
        <div className="space-y-2 py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
              {doctor.hospital}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{doctor.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{doctor.email}</span>
          </div>
        </div>
      </div>

      {/* Footer: Patients count & View Patients Button */}
      <div className="pt-4 flex items-center justify-between gap-3 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Users className="w-4 h-4 text-indigo-500" />
          <span>
            <strong className="text-slate-900 dark:text-white font-semibold">
              {doctor.patientsCount ?? 0}
            </strong>{" "}
            {doctor.patientsCount === 1 ? "Patient" : "Patients"}
          </span>
        </div>

        <button
          onClick={() => onViewPatients(doctor)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800/80 transition-colors"
        >
          View Patients
        </button>
      </div>
    </div>
  );
}

