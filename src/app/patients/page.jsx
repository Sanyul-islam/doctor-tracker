"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PatientTable } from "@/components/patients/PatientTable";
import { PatientFormModal } from "@/components/patients/PatientFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { CONDITION_CATEGORIES, PATIENT_STATUSES } from "@/lib/mockData";
import {
  Search,
  Plus,
  RotateCcw,
  Loader2,
  Users,
  Filter,
  Calendar,
  X,
  HeartPulse,
} from "lucide-react";

export default function PatientsPage() {
  const toast = useToast();

  // State
  const [patients, setPatients] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [doctorId, setDoctorId] = useState("ALL");
  const [gender, setGender] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState(null);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status counters
  const [statusStats, setStatusStats] = useState({
    total: 0,
    active: 0,
    inTreatment: 0,
    recovered: 0,
    critical: 0,
  });

  const fetchPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      const [patientsRes, doctorsRes] = await Promise.all([
        api.getPatients({
          search,
          condition,
          status,
          doctorId,
          gender,
          startDate,
          endDate,
          page: pagination.page,
          limit: pagination.limit,
        }),
        api.getDoctors({ limit: 100 }),
      ]);

      setPatients(patientsRes.data || []);
      setPagination(patientsRes.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      setDoctorsList(doctorsRes.data || []);

      // Calculate overview counters
      const allPatientsRes = await api.getPatients({ limit: 500 });
      const all = allPatientsRes.data || [];
      setStatusStats({
        total: all.length,
        active: all.filter((p) => p.status === "Active").length,
        inTreatment: all.filter((p) => p.status === "In Treatment").length,
        recovered: all.filter((p) => p.status === "Recovered").length,
        critical: all.filter((p) => p.status === "Critical").length,
      });
    } catch {
      toast.error("Failed to fetch patients list");
    } finally {
      setIsLoading(false);
    }
  }, [
    search,
    condition,
    status,
    doctorId,
    gender,
    startDate,
    endDate,
    pagination.page,
    pagination.limit,
    toast,
  ]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleResetFilters = () => {
    setSearch("");
    setCondition("ALL");
    setStatus("ALL");
    setDoctorId("ALL");
    setGender("ALL");
    setStartDate("");
    setEndDate("");
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const handleSavePatient = async (formData) => {
    if (selectedPatientForEdit) {
      await api.updatePatient(selectedPatientForEdit.id, formData);
      toast.success(`Updated patient record for ${formData.name}`);
    } else {
      await api.createPatient(formData);
      toast.success(`Intake created for ${formData.name}`);
    }
    fetchPatients();
  };

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
    try {
      setIsDeleting(true);
      await api.deletePatient(patientToDelete.id);
      toast.success(`Removed patient ${patientToDelete.name}`);
      setPatientToDelete(null);
      fetchPatients();
    } catch {
      toast.error("Failed to delete patient");
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters =
    search ||
    condition !== "ALL" ||
    status !== "ALL" ||
    doctorId !== "ALL" ||
    gender !== "ALL" ||
    startDate ||
    endDate;

  return (
    <AppLayout title="Patient Directory">
      <div className="space-y-6">
        {/* Header Title & Add Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Patient Management & Records
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Centralized register of patient diagnoses, assigned physicians, and recovery milestones.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedPatientForEdit(null);
              setIsFormModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Intake New Patient
          </button>
        </div>

        {/* Status Summary Quick Filter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div
            onClick={() => {
              setStatus("ALL");
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              status === "ALL"
                ? "bg-slate-900 text-white border-slate-800 shadow-sm"
                : "bg-white text-slate-600 border-sky-200 hover:border-sky-300"
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
              All Patients
            </span>
            <span className="text-lg font-bold">{statusStats.total}</span>
          </div>

          <div
            onClick={() => {
              setStatus("Active");
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              status === "Active"
                ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                : "bg-white text-sky-600 border-sky-200 hover:border-sky-400"
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
              Active Cases
            </span>
            <span className="text-lg font-bold">{statusStats.active}</span>
          </div>

          <div
            onClick={() => {
              setStatus("In Treatment");
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              status === "In Treatment"
                ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                : "bg-white text-amber-600 border-amber-200 hover:border-amber-400"
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
              In Treatment
            </span>
            <span className="text-lg font-bold">{statusStats.inTreatment}</span>
          </div>

          <div
            onClick={() => {
              setStatus("Recovered");
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              status === "Recovered"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-white text-emerald-600 border-emerald-200 hover:border-emerald-400"
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
              Recovered
            </span>
            <span className="text-lg font-bold">{statusStats.recovered}</span>
          </div>

          <div
            onClick={() => {
              setStatus("Critical");
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className={`p-3 rounded-xl border cursor-pointer transition-all col-span-2 sm:col-span-1 ${
              status === "Critical"
                ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                : "bg-white text-rose-600 border-rose-200 hover:border-rose-400"
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
              Critical
            </span>
            <span className="text-lg font-bold">{statusStats.critical}</span>
          </div>
        </div>

        {/* Search & Filters Controls */}
        <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search patient name, condition, phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-sky-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Condition Category Filter */}
            <div>
              <select
                value={condition}
                onChange={(e) => {
                  setCondition(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="w-full px-3 py-2 rounded-xl border border-sky-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="ALL">All Conditions</option>
                {CONDITION_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned Doctor Filter */}
            <div>
              <select
                value={doctorId}
                onChange={(e) => {
                  setDoctorId(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="w-full px-3 py-2 rounded-xl border border-sky-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="ALL">All Attending Doctors</option>
                {doctorsList.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Admission Date Range Filter */}
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                title="Admission Start Date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="w-1/2 px-2.5 py-1.5 rounded-xl border border-sky-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <span className="text-slate-400 text-xs">to</span>
              <input
                type="date"
                title="Admission End Date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="w-1/2 px-2.5 py-1.5 rounded-xl border border-sky-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* Reset Filters chip */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-sky-100 text-xs">
              <span className="text-slate-500">
                Found <strong>{pagination.total}</strong> matching patient records
              </span>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-800 hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Content: Loading, Empty, or Table */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
            <p className="text-sm font-medium">Fetching patient records...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-sky-50/40 border border-dashed border-sky-200">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-semibold text-slate-800">
              No patients found matching query
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Try adjusting your condition filters, search terms, or intake a new patient.
            </p>
            {hasActiveFilters ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-100 hover:bg-sky-200 text-sky-700 transition-colors"
              >
                Reset Filters
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedPatientForEdit(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                Intake First Patient
              </button>
            )}
          </div>
        ) : (
          <PatientTable
            patients={patients}
            onEdit={(pat) => {
              setSelectedPatientForEdit(pat);
              setIsFormModalOpen(true);
            }}
            onDelete={(pat) => setPatientToDelete(pat)}
          />
        )}

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          pageSize={pagination.limit}
          onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
          onPageSizeChange={(limit) => setPagination((p) => ({ ...p, limit, page: 1 }))}
          pageSizeOptions={[10, 20, 50]}
        />
      </div>

      {/* Patient Create / Edit Modal */}
      <PatientFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedPatientForEdit(null);
        }}
        onSubmit={handleSavePatient}
        patient={selectedPatientForEdit}
        doctors={doctorsList}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!patientToDelete}
        onClose={() => setPatientToDelete(null)}
        onConfirm={handleDeletePatient}
        isLoading={isDeleting}
        title="Delete Patient Record?"
        message={`Are you sure you want to permanently delete "${patientToDelete?.name}"? This action cannot be reversed.`}
        confirmLabel="Yes, Delete Record"
      />
    </AppLayout>
  );
}

