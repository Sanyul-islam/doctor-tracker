import React from "react";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Edit2, Trash2, Stethoscope } from "lucide-react";

export function PatientTable({ patients, onEdit, onDelete }) {
  return (
    <div className="border border-sky-100 rounded-3xl overflow-hidden shadow-[0_4px_22px_rgba(186,230,253,0.18)] bg-white/90 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-sky-50/90 via-blue-50/40 to-sky-50/80 border-b border-sky-100 text-sky-800 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-4 px-5">Patient</th>
              <th className="py-4 px-5">Demographics</th>
              <th className="py-4 px-5">Diagnosis / Condition</th>
              <th className="py-4 px-5">Assigned Doctor</th>
              <th className="py-4 px-5">Status</th>
              <th className="py-4 px-5">Admission Date</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-50">
            {patients.map((pat) => (
              <tr
                key={pat.id}
                className="hover:bg-sky-50/60 transition-colors"
              >
                {/* Patient Name & Contact */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-100 to-sky-200 text-sky-800 font-extrabold flex items-center justify-center shrink-0 border border-sky-200 text-xs shadow-2xs">
                      {pat.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block">
                        {pat.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {pat.phone || pat.email || "No direct contact"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Demographics */}
                <td className="py-3.5 px-5 text-slate-700">
                  <span className="font-bold">{pat.age} yrs</span>
                  <span className="block text-[11px] text-slate-400">{pat.gender}</span>
                </td>

                {/* Condition */}
                <td className="py-3.5 px-5">
                  <span className="font-bold text-slate-900 block">
                    {pat.condition}
                  </span>
                  <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100">
                    {pat.conditionCategory || "General"}
                  </span>
                </td>

                {/* Assigned Doctor */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {pat.doctorName || "Unassigned"}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px] block">
                        {pat.doctorHospital || "N/A"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-5">
                  <StatusBadge status={pat.status} />
                </td>

                {/* Admission Date */}
                <td className="py-3.5 px-5 text-slate-600 font-medium">
                  {formatDate(pat.admissionDate || pat.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(pat)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                      title="Edit patient details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(pat)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete patient"
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
