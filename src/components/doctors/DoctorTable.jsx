import React from "react";
import { SpecialtyBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Edit2, Trash2, Users } from "lucide-react";

export function DoctorTable({ doctors, onViewPatients, onEdit, onDelete }) {
  return (
    <div className="border border-sky-100 rounded-3xl overflow-hidden shadow-[0_4px_22px_rgba(186,230,253,0.18)] bg-white/90 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-sky-50/90 via-blue-50/40 to-sky-50/80 border-b border-sky-100 text-sky-800 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-4 px-5">Doctor</th>
              <th className="py-4 px-5">Specialization</th>
              <th className="py-4 px-5">Hospital</th>
              <th className="py-4 px-5">Contact</th>
              <th className="py-4 px-5">Patients</th>
              <th className="py-4 px-5">Registered</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-50">
            {doctors.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-sky-50/60 transition-colors"
              >
                {/* Doctor Name & Avatar */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-sky-500 to-indigo-600 text-white font-extrabold flex items-center justify-center shrink-0 shadow-sm shadow-sky-500/20 text-xs">
                      {doc.name.replace("Dr. ", "").substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block">
                        {doc.name}
                      </span>
                      <span className="text-[11px] text-slate-400">{doc.email}</span>
                    </div>
                  </div>
                </td>

                {/* Specialization */}
                <td className="py-3.5 px-5">
                  <SpecialtyBadge specialty={doc.specialization} />
                </td>

                {/* Hospital */}
                <td className="py-3.5 px-5 text-slate-700 font-semibold">
                  {doc.hospital}
                </td>

                {/* Contact */}
                <td className="py-3.5 px-5 text-slate-600">
                  <span>{doc.phone}</span>
                </td>

                {/* Patients Count */}
                <td className="py-3.5 px-5">
                  <button
                    onClick={() => onViewPatients(doc)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors shadow-2xs"
                  >
                    <Users className="w-3.5 h-3.5 text-sky-500" />
                    <span>{doc.patientsCount ?? 0}</span>
                  </button>
                </td>

                {/* Registration Date */}
                <td className="py-3.5 px-5 text-slate-500">
                  {formatDate(doc.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onViewPatients(doc)}
                      className="px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors"
                    >
                      Patients
                    </button>
                    <button
                      onClick={() => onEdit(doc)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                      title="Edit doctor"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(doc)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
