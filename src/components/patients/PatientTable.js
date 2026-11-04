import React from "react";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Edit2, Trash2, User, Phone, Mail, Stethoscope } from "lucide-react";

export function PatientTable({ patients, onEdit, onDelete }) {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4">Patient</th>
              <th className="py-3.5 px-4">Demographics</th>
              <th className="py-3.5 px-4">Diagnosis / Condition</th>
              <th className="py-3.5 px-4">Assigned Doctor</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Admission Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {patients.map((pat) => (
              <tr
                key={pat.id}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Patient Name & Contact */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 text-xs">
                      {pat.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {pat.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {pat.phone || pat.email || "No direct contact"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Demographics */}
                <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  <span className="font-medium">{pat.age} yrs</span>
                  <span className="block text-[11px] text-slate-400">{pat.gender}</span>
                </td>

                {/* Condition */}
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    {pat.condition}
                  </span>
                  <span className="inline-block mt-0.5 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {pat.conditionCategory || "General"}
                  </span>
                </td>

                {/* Assigned Doctor */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        {pat.doctorName || "Unassigned"}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px] block">
                        {pat.doctorHospital || "N/A"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <StatusBadge status={pat.status} />
                </td>

                {/* Admission Date */}
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  {formatDate(pat.admissionDate || pat.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(pat)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit patient details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(pat)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
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

