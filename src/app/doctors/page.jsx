"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { DoctorTable } from "@/components/doctors/DoctorTable";
import { DoctorFormModal } from "@/components/doctors/DoctorFormModal";
import { DoctorDetailModal } from "@/components/doctors/DoctorDetailModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { SPECIALIZATIONS, HOSPITALS } from "@/lib/mockData";
import {
  Search,
  Filter,
  UserPlus,
  LayoutGrid,
  List,
  RotateCcw,
  Loader2,
  Calendar,
  X,
  Stethoscope,
} from "lucide-react";

export default function DoctorsPage() {
  const toast = useToast();

  // State
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Controls
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("ALL");
  const [hospital, setHospital] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  // Modals & Active Records
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedDoctorForEdit, setSelectedDoctorForEdit] = useState(null);
  const [selectedDoctorForView, setSelectedDoctorForView] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDoctors = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.getDoctors({
        search,
        specialization,
        hospital,
        startDate,
        endDate,
        page: pagination.page,
        limit: pagination.limit,
      });

    setDoctors(res.doctors || []);
    setPagination({
      page: res.pagination?.currentPage || 1,
      limit: res.pagination?.limit || 6,
      total: res.pagination?.totalDoctors || 0,
      totalPages: res.pagination?.totalPages || 1,
    });
    } catch {
      toast.error("Failed to load doctors list");
    } finally {
      setIsLoading(false);
    }
  }, [search, specialization, hospital, startDate, endDate, pagination.page, pagination.limit, toast]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleResetFilters = () => {
    setSearch("");
    setSpecialization("ALL");
    setHospital("ALL");
    setStartDate("");
    setEndDate("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSaveDoctor = async (formData) => {
    if (selectedDoctorForEdit) {
      await api.updateDoctor(selectedDoctorForEdit._id, formData);
      toast.success(`Updated Dr. ${formData.name.replace("Dr. ", "")}`);
    } else {
      await api.createDoctor(formData);
      toast.success(`Registered Dr. ${formData.name.replace("Dr. ", "")}`);
    }
    fetchDoctors();
  };

  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;
    try {
      setIsDeleting(true);
      await api.deleteDoctor(doctorToDelete._id);
      toast.success(`Removed ${doctorToDelete.name} from directory`);
      setDoctorToDelete(null);
      fetchDoctors();
    } catch {
      toast.error("Failed to delete doctor");
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters =
    search || specialization !== "ALL" || hospital !== "ALL" || startDate || endDate;

  return (
    <AppLayout title="Doctor Directory">
      <div className="space-y-6">
        {/* Header Title & Add Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Medical Staff & Physicians
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse, filter, and manage licensed physicians and their assigned patient cases.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl border border-sky-200 bg-white shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-sky-700"
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-sky-700"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                setSelectedDoctorForEdit(null);
                setIsFormModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Register Doctor
            </button>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search name, hospital, email..."
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

            {/* Specialization Filter */}
            <div>
              <select
                value={specialization}
                onChange={(e) => {
                  setSpecialization(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="w-full px-3 py-2 rounded-xl border border-sky-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="ALL">All Specializations</option>
                {SPECIALIZATIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Hospital Filter */}
            <div>
              <select
                value={hospital}
                onChange={(e) => {
                  setHospital(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="w-full px-3 py-2 rounded-xl border border-sky-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="ALL">All Hospitals</option>
                {HOSPITALS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Date-wise Filter Inputs */}
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                title="Registration Start Date"
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
                title="Registration End Date"
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
                Found <strong>{pagination.total}</strong> matching physician records
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

        {/* Content: Loading, Empty, Grid, or Table */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
            <p className="text-sm font-medium">Fetching doctor records...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-sky-50/40 border border-dashed border-sky-200">
            <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-semibold text-slate-800">
              No doctors found matching query
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Try adjusting your search criteria, clearing the filters, or register a new physician.
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
                  setSelectedDoctorForEdit(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                Register First Doctor
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onViewPatients={(doc) => setSelectedDoctorForView(doc)}
                onEdit={(doc) => {
                  setSelectedDoctorForEdit(doc);
                  setIsFormModalOpen(true);
                }}
                onDelete={(doc) => setDoctorToDelete(doc)}
              />
            ))}
          </div>
        ) : (
          <DoctorTable
            doctors={doctors}
            onViewPatients={(doc) => setSelectedDoctorForView(doc)}
            onEdit={(doc) => {
              setSelectedDoctorForEdit(doc);
              setIsFormModalOpen(true);
            }}
            onDelete={(doc) => setDoctorToDelete(doc)}
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
          pageSizeOptions={[6, 9, 12, 24]}
        />
      </div>

      {/* Doctor Create / Edit Modal */}
      <DoctorFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedDoctorForEdit(null);
        }}
        onSubmit={handleSaveDoctor}
        doctor={selectedDoctorForEdit}
      />

      {/* Doctor Details & Patients Management Modal */}
      <DoctorDetailModal
        isOpen={!!selectedDoctorForView}
        onClose={() => setSelectedDoctorForView(null)}
        doctor={selectedDoctorForView}
        onPatientUpdated={fetchDoctors}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!doctorToDelete}
        onClose={() => setDoctorToDelete(null)}
        onConfirm={handleDeleteDoctor}
        isLoading={isDeleting}
        title="Remove Doctor Record?"
        message={`Are you sure you want to remove ${doctorToDelete?.name}? Assigned patients will become unassigned.`}
        confirmLabel="Yes, Remove Doctor"
      />
    </AppLayout>
  );
}

