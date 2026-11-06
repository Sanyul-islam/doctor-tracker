"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { SPECIALIZATIONS, HOSPITALS } from "@/lib/mockData";
import { Loader2 } from "lucide-react";

export function DoctorFormModal({ isOpen, onClose, onSubmit, doctor = null }) {
  const isEditing = !!doctor;

  const [formData, setFormData] = useState({
    name: "",
    specialization: SPECIALIZATIONS[0] || "Cardiology",
    hospital: HOSPITALS[0] || "Metro General Hospital",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || "",
        specialization: doctor.specialization || SPECIALIZATIONS[0],
        hospital: doctor.hospital || HOSPITALS[0],
        phone: doctor.phone || "",
        email: doctor.email || "",
      });
    } else {
      setFormData({
        name: "",
        specialization: SPECIALIZATIONS[0] || "Cardiology",
        hospital: HOSPITALS[0] || "Metro General Hospital",
        phone: "",
        email: "",
      });
    }
    setErrors({});
  }, [doctor, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Doctor name is required";
    if (!formData.specialization.trim()) errs.specialization = "Specialization is required";
    if (!formData.hospital.trim()) errs.hospital = "Hospital is required";
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    }
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.message || "Failed to save doctor" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Doctor Profile" : "Register New Doctor"}
      description="Enter the professional credentials and hospital contact details."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
            {errors.submit}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>

          <input
            type="text"
            placeholder="e.g. Dr. Sarah Jenkins"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              errors.name
                ? "border-rose-500 focus:ring-rose-500"
                : "border-slate-200 dark:border-slate-700"
            }`}
          />

          {errors.name && (
            <p className="text-xs text-rose-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Specialization & Hospital */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Specialization <span className="text-rose-500">*</span>
            </label>

            <select
              value={formData.specialization}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specialization: e.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:border-slate-700"
            >
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Hospital <span className="text-rose-500">*</span>
            </label>

            <select
              value={formData.hospital}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hospital: e.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:border-slate-700"
            >
              {HOSPITALS.map((hosp) => (
                <option key={hosp} value={hosp}>
                  {hosp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>

            <input
              type="email"
              placeholder="doctor@hospital.org"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                errors.email
                  ? "border-rose-500 focus:ring-rose-500"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />

            {errors.email && (
              <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Phone Number <span className="text-rose-500">*</span>
            </label>

            <input
              type="tel"
              placeholder="+880 1XXX-XXXXXX"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                errors.phone
                  ? "border-rose-500 focus:ring-rose-500"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />

            {errors.phone && (
              <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors disabled:opacity-50 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}

            {isEditing ? "Save Changes" : "Create Doctor"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

