"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/StatCard";
import {
  PatientsPerDoctorChart,
  DateBasedAdmissionTrendChart,
  ConditionDistributionChart,
} from "@/components/dashboard/AnalyticsCharts";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { DoctorFormModal } from "@/components/doctors/DoctorFormModal";
import { PatientFormModal } from "@/components/patients/PatientFormModal";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import {
  UserCheck,
  Users,
  Activity,
  AlertTriangle,
  UserPlus,
  Stethoscope,
  RefreshCw,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const toast = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [doctorsList, setDoctorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [analyticsData, doctorsRes] = await Promise.all([
        api.getDashboardAnalytics(),
        api.getDoctors({ limit: 100 }),
      ]);
      setAnalytics(analyticsData);
      setDoctorsList(doctorsRes.data || []);
    } catch {
      toast.error("Failed to load dashboard metrics");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreateDoctor = async (formData) => {
    await api.createDoctor(formData);
    toast.success(`Registered Dr. ${formData.name.replace("Dr. ", "")}`);
    await fetchDashboardData();
  };

  const handleCreatePatient = async (formData) => {
    await api.createPatient(formData);
    toast.success(`Intake created for ${formData.name}`);
    await fetchDashboardData();
  };

  return (
    <AppLayout title="Clinical Dashboard">
      <div className="space-y-6">
        {/* Page Header & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Hospital Analytics & Workload
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time monitoring of physician rosters, admissions, and departmental distribution.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 rounded-xl border border-sky-200 bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setIsPatientModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white border border-sky-200 text-slate-800 hover:bg-sky-50 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Patient
            </button>
            <button
              onClick={() => setIsDoctorModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Doctor
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Registered Doctors"
            value={analytics ? analytics.totalDoctors : "—"}
            subtitle="Across 5 affiliated hospitals"
            icon={Stethoscope}
            trend="+2 this month"
            trendType="up"
            color="indigo"
          />

          <StatCard
            title="Total Active Patients"
            value={analytics ? analytics.totalPatients : "—"}
            subtitle="Admitted & in-care treatments"
            icon={Users}
            trend="+18% YoY"
            trendType="up"
            color="sky"
          />

          <StatCard
            title="Avg. Patients / Doctor"
            value={analytics ? analytics.avgPatientsPerDoctor : "—"}
            subtitle="Caseload ratio benchmark"
            icon={Activity}
            trend="Balanced"
            trendType="neutral"
            color="emerald"
          />

          <StatCard
            title="Critical In-Patients"
            value={analytics ? analytics.criticalCases : "—"}
            subtitle="Requiring immediate rounds"
            icon={AlertTriangle}
            trend="Active Priority"
            trendType={analytics?.criticalCases > 0 ? "urgent" : "neutral"}
            color="rose"
          />
        </div>

        {/* Charts Grid Row 1: Patients per Doctor & Monthly Admission Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PatientsPerDoctorChart data={analytics?.patientsPerDoctor || []} />
          <DateBasedAdmissionTrendChart data={analytics?.monthlyAdmissions || []} />
        </div>

        {/* Charts Grid Row 2: Condition Categories & Recent Admissions Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConditionDistributionChart data={analytics?.conditionDistribution || []} />
          <ActivityFeed recentPatients={analytics?.recentPatients || []} />
        </div>
      </div>

      {/* Doctor Create Modal */}
      <DoctorFormModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onSubmit={handleCreateDoctor}
      />

      {/* Patient Create Modal */}
      <PatientFormModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSubmit={handleCreatePatient}
        doctors={doctorsList}
      />
    </AppLayout>
  );
}

