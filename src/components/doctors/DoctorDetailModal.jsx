"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge, SpecialtyBadge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { formatDate } from "@/lib/utils";
import {
  User,
  Building2,
  Mail,
  Phone,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { CONDITION_CATEGORIES, PATIENT_STATUSES } from "@/lib/mockData";

export function DoctorDetailModal({
  isOpen,
  onClose,
  doctor,
  onPatientUpdated,
}) {
  const toast = useToast();

  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const initialPatientState = {
    name: "",
    age: "",
    gender: "Female",
    condition: "",
    conditionCategory: "General",
    status: "Active",
    phone: "",
    admissionDate: new Date().toISOString().split("T")[0],
    notes: "",
  };

  const [newPatient, setNewPatient] = useState(initialPatientState);

  const fetchDoctorPatients = useCallback(async () => {
    if (!doctor?._id) return;

    try {
      setIsLoading(true);

      const res = await api.getPatientsByDoctor(doctor._id);

      setPatients(res || []);
    } catch {
      toast.error("Failed to load doctor's patients");
    } finally {
      setIsLoading(false);
    }
  }, [doctor?._id, toast]);

  useEffect(() => {
    if (isOpen && doctor) {
      fetchDoctorPatients();
      setShowAddForm(false);
    }
  }, [isOpen, doctor, fetchDoctorPatients]);

  const handleAddPatient = async (e) => {
    e.preventDefault();

    if (!newPatient.name.trim() || !newPatient.condition.trim()) {
      toast.warning("Please provide patient name and medical condition");
      return;
    }

    try {
      setIsAdding(true);

      await api.createPatient({
        ...newPatient,
        doctorId: doctor._id,
      });

      toast.success(
        `${newPatient.name} added under Dr. ${doctor.name.replace(/^Dr\.\s*/i, "")}`,
      );

      setNewPatient({
        ...initialPatientState,
        admissionDate: new Date().toISOString().split("T")[0],
      });

      setShowAddForm(false);

      await fetchDoctorPatients();

      if (onPatientUpdated) onPatientUpdated();
    } catch (err) {
      toast.error(err.message || "Failed to add patient");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;

    try {
      setIsDeleting(true);

      await api.deletePatient(patientToDelete._id);

      toast.success(`Removed patient ${patientToDelete.name}`);

      setPatientToDelete(null);

      await fetchDoctorPatients();

      if (onPatientUpdated) onPatientUpdated();
    } catch {
      toast.error("Failed to delete patient");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!doctor) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={doctor.name}
        description={`Clinical profile and managed patient list (${patients.length} assigned)`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Doctor Information */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Specialty
              </span>

              <div className="mt-1">
                <SpecialtyBadge specialty={doctor.specialization} />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Hospital
              </span>

              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                {doctor.hospital}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Contact Phone
              </span>

              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5 truncate">
                <Phone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                {doctor.phone}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Email
              </span>

              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                {doctor.email}
              </p>
            </div>
          </div>

          {/* Assigned Patients */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  Assigned Patients ({patients.length})
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage patient cases directly under this doctor
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />

                {showAddForm ? "Cancel" : "Add Patient to Doctor"}
              </button>
            </div>

            {/* Quick Add Patient Form */}
            {showAddForm && (
              <form
                onSubmit={handleAddPatient}
                className="p-4 mb-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 animate-in fade-in slide-in-from-top-2 space-y-4"
              >
                <div>
                  <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                    New Patient Intake
                  </h5>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Register a new patient under {doctor.name}
                  </p>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Patient Full Name <span className="text-rose-500">*</span>
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      required
                      value={newPatient.name}
                      onChange={(e) =>
                        setNewPatient({
                          ...newPatient,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Age
                    </label>

                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 45"
                      value={newPatient.age}
                      onChange={(e) =>
                        setNewPatient({
                          ...newPatient,
                          age: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Gender
                    </label>

                    <select
                      value={newPatient.gender}
                      onChange={(e) =>
                        setNewPatient({
                          ...newPatient,
                          gender: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Condition and Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Condition / Diagnosis{" "}
                      <span className="text-rose-500">*</span>
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Hypertension Stage 1"
                      required
                      value={newPatient.condition}
                      onChange={(e) =>
                        setNewPatient({
                          ...newPatient,
                          condition: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Condition Category
                    </label>

                    <select
                      value={newPatient.conditionCategory}
                      onChange={(e) =>
                        setNewPatient({
                          ...newPatient,
                          conditionCategory: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {CONDITION_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Patient Status
                    </label>

                    <select
                      value={newPatient.status}
                      onChange={(e) =>
                        setNewPatient({
                          ...newPatient,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {PATIENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Admission Date and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Admission Date
                    </label>

                    <input
                      type="date"
                      value={newPatient.admissionDate}
                      onChange={(e) =>
                        setNewPatient({
                          ...newPatient,
                          admissionDate: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Contact Phone
                    </label>

                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={newPatient.phone}
                      onChange={(e) =>
                        setNewPatient({
                          ...newPatient,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Clinical Notes */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Clinical Notes
                  </label>

                  <textarea
                    rows={3}
                    placeholder="Important medical notes or follow-up instructions..."
                    value={newPatient.notes}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        notes: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  />
                </div>

                {/* Form Footer */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-indigo-200 dark:border-indigo-900">
                  <button
                    type="button"
                    disabled={isAdding}
                    onClick={() => setShowAddForm(false)}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isAdding}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
                  >
                    {isAdding && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                    Save Patient
                  </button>
                </div>
              </form>
            )}

            {/* Patients List */}
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mb-2" />
                <span className="text-xs">Loading patient records...</span>
              </div>
            ) : patients.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                <User className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />

                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  No patients currently assigned to {doctor.name}.
                </p>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click "Add Patient to Doctor" above to register a patient
                  case.
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Patient Name</th>
                        <th className="py-3 px-4">Age / Gender</th>
                        <th className="py-3 px-4">Condition</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Admitted</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {patients.map((pat) => (
                        <tr
                          key={pat._id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                            {pat.name}
                          </td>

                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                            {pat.age} yrs • {pat.gender}
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {pat.condition}
                            </span>

                            <span className="block text-[10px] text-slate-400">
                              {pat.conditionCategory}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <StatusBadge status={pat.status} />
                          </td>

                          <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                            {formatDate(pat.admissionDate)}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setPatientToDelete(pat)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete patient from doctor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Patient Confirmation */}
      <ConfirmDialog
        isOpen={!!patientToDelete}
        onClose={() => setPatientToDelete(null)}
        onConfirm={handleDeletePatient}
        isLoading={isDeleting}
        title="Delete Patient Record?"
        message={`Are you sure you want to remove "${patientToDelete?.name}" from ${doctor.name}'s care?`}
        confirmLabel="Yes, Delete Patient"
      />
    </>
  );
}