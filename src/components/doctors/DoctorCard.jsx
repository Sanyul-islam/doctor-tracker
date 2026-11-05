import React from "react";
import { SpecialtyBadge } from "@/components/ui/Badge";
import { Building2, Mail, Phone, Users, Edit2, Trash2, ArrowUpRight } from "lucide-react";

export function DoctorCard({ doctor, onViewPatients, onEdit, onDelete }) {
  return (
    <div className="group relative bg-white/90 backdrop-blur-md border border-sky-100 rounded-3xl p-5 shadow-[0_4px_20px_rgba(186,230,253,0.18)] hover:shadow-[0_12px_32px_rgba(186,230,253,0.32)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Top row: Avatar, Specialty badge, Menu */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform">
              {doctor.name.replace("Dr. ", "").substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
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
              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
              title="Edit doctor"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(doctor)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Delete doctor"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Rows */}
        <div className="space-y-2 py-3.5 border-y border-sky-50 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-500 shrink-0" />
            <span className="font-semibold text-slate-800 truncate">
              {doctor.hospital}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="truncate">{doctor.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="truncate text-slate-500">{doctor.email}</span>
          </div>
        </div>
      </div>

      {/* Footer: Patients count & View Patients Button */}
      <div className="pt-4 flex items-center justify-between gap-3 mt-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <div className="p-1.5 rounded-lg bg-sky-50 border border-sky-100 text-sky-600">
            <Users className="w-3.5 h-3.5" />
          </div>
          <span>
            <strong className="text-slate-900 font-bold">
              {doctor.patientsCount ?? 0}
            </strong>{" "}
            {doctor.patientsCount === 1 ? "Patient" : "Patients"}
          </span>
        </div>

        <button
          onClick={() => onViewPatients(doctor)}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 shadow-2xs hover:shadow-xs transition-all"
        >
          <span>View Patients</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-sky-500" />
        </button>
      </div>
    </div>
  );
}
