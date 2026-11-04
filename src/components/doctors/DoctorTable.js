import React from "react";
import { SpecialtyBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Edit2, Trash2, Users, Building2, Phone, Mail } from "lucide-react";

export function DoctorTable({ doctors, onViewPatients, onEdit, onDelete }) {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4">Doctor</th>
              <th className="py-3.5 px-4">Specialization</th>
              <th className="py-3.5 px-4">Hospital</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Patients</th>
              <th className="py-3.5 px-4">Registered</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {doctors.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Doctor Name & Avatar */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center shrink-0 border border-indigo-500/20 text-xs">
                      {doc.name.replace("Dr. ", "").substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {doc.name}
                      </span>
                      <span className="text-[11px] text-slate-400">{doc.email}</span>
                    </div>
                  </div>
                </td>

                {/* Specialization */}
                <td className="py-3.5 px-4">
                  <SpecialtyBadge specialty={doc.specialization} />
                </td>

                {/* Hospital */}
                <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                  {doc.hospital}
                </td>

                {/* Contact */}
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                  <span>{doc.phone}</span>
                </td>

                {/* Patients Count */}
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => onViewPatients(doc)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{doc.patientsCount ?? 0}</span>
                  </button>
                </td>

                {/* Registration Date */}
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                  {formatDate(doc.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onViewPatients(doc)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                    >
                      Patients
                    </button>
                    <button
                      onClick={() => onEdit(doc)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                      title="Edit doctor"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(doc)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Delete doctor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

