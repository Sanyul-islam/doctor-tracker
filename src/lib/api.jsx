import { INITIAL_DOCTORS, INITIAL_PATIENTS } from "./mockData";

const STORAGE_KEYS = {
  DOCTORS: "dt_doctors_v1",
  PATIENTS: "dt_patients_v1",
  AUTH: "dt_auth_session",
  MODE: "dt_api_mode", // 'mock' or 'real'
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Initialize LocalStorage with seed data if not present
function initializeStorage() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
  }
}

function getStoredDoctors() {
  if (typeof window === "undefined") return INITIAL_DOCTORS;
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    return raw ? JSON.parse(raw) : INITIAL_DOCTORS;
  } catch {
    return INITIAL_DOCTORS;
  }
}

function saveStoredDoctors(doctors) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
}

function getStoredPatients() {
  if (typeof window === "undefined") return INITIAL_PATIENTS;
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return raw ? JSON.parse(raw) : INITIAL_PATIENTS;
  } catch {
    return INITIAL_PATIENTS;
  }
}

function saveStoredPatients(patients) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
}

// Check if user forced real API or mock
export function getApiMode() {
  if (typeof window === "undefined") return "mock";
  return localStorage.getItem(STORAGE_KEYS.MODE) || "mock";
}

export function setApiMode(mode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.MODE, mode);
}

// REST request helper with graceful fallback
async function fetchWithFallback(endpoint, options = {}, mockHandler) {
  const mode = getApiMode();

  if (mode === "real") {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `API error: ${res.status}`);
    }

    return data;
  }

  await new Promise((resolve) => setTimeout(resolve, 80));

  return mockHandler();
}

// Direct Backend API Request
async function apiRequest(endpoint, options = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `API Error: ${res.status}`);
  }

  return data;
}

export const api = {
  // Reset data to default seed
  resetData: () => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    localStorage.setItem(
      STORAGE_KEYS.PATIENTS,
      JSON.stringify(INITIAL_PATIENTS),
    );
  },

  // ---------------- AUTH ----------------
  async login({ email, password }) {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getMe() {
    return apiRequest("/auth/me");
  },

  logout() {
    return apiRequest("/auth/logout", {
      method: "POST",
    });
  },
  // ---------------- DOCTORS ----------------
  async getDoctors({
    search = "",
    specialization = "ALL",
    hospital = "ALL",
    startDate = "",
    endDate = "",
    page = 1,
    limit = 6,
    sortBy = "createdAt",
    order = "desc",
  } = {}) {
    const params = new URLSearchParams({
      search,
      specialization,
      hospital,
      startDate,
      endDate,
      page: String(page),
      limit: String(limit),
      sortBy,
      order,
    });

    return apiRequest(`/doctors?${params.toString()}`);
  },

  async getDoctorById(id) {
    return fetchWithFallback(`/doctors/${id}`, { method: "GET" }, () => {
      const doctors = getStoredDoctors();
      const doc = doctors.find((d) => d.id === id);
      if (!doc) throw new Error("Doctor not found");
      const patients = getStoredPatients().filter((p) => p.doctorId === id);
      return { ...doc, patients, patientsCount: patients.length };
    });
  },

  async createDoctor(data) {
    return fetchWithFallback(
      "/doctors",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      () => {
        const doctors = getStoredDoctors();
        // Validation
        if (
          !data.name ||
          !data.specialization ||
          !data.hospital ||
          !data.phone ||
          !data.email
        ) {
          throw new Error(
            "All fields (Name, Specialization, Hospital, Phone, Email) are required.",
          );
        }
        const newDoctor = {
          id: `doc_${Date.now()}`,
          name: data.name.trim(),
          specialization: data.specialization.trim(),
          hospital: data.hospital.trim(),
          phone: data.phone.trim(),
          email: data.email.trim(),
          createdAt: new Date().toISOString(),
          patientsCount: 0,
        };
        const updated = [newDoctor, ...doctors];
        saveStoredDoctors(updated);
        return newDoctor;
      },
    );
  },

  async updateDoctor(id, data) {
    return fetchWithFallback(
      `/doctors/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      () => {
        const doctors = getStoredDoctors();
        const index = doctors.findIndex((d) => d.id === id);
        if (index === -1) throw new Error("Doctor not found");

        const updatedDoc = {
          ...doctors[index],
          ...data,
          id, // preserve ID
        };
        doctors[index] = updatedDoc;
        saveStoredDoctors(doctors);
        return updatedDoc;
      },
    );
  },

  async deleteDoctor(id) {
    return fetchWithFallback(`/doctors/${id}`, { method: "DELETE" }, () => {
      const doctors = getStoredDoctors();
      const updatedDoctors = doctors.filter((d) => d.id !== id);
      saveStoredDoctors(updatedDoctors);

      // Also unassign or remove linked patients
      const patients = getStoredPatients();
      const updatedPatients = patients.map((p) =>
        p.doctorId === id ? { ...p, doctorId: null } : p,
      );
      saveStoredPatients(updatedPatients);

      return { success: true, id };
    });
  },

  // ---------------- PATIENTS ----------------
  async getPatients({
    search = "",
    condition = "ALL",
    status = "ALL",
    gender = "ALL",
    doctorId = "ALL",
    startDate = "",
    endDate = "",
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = {}) {
    const params = new URLSearchParams({
      search,
      condition,
      status,
      gender,
      doctorId,
      startDate,
      endDate,
      page: String(page),
      limit: String(limit),
      sortBy,
      order,
    });

    return fetchWithFallback(
      `/patients?${params.toString()}`,
      { method: "GET" },
      () => {
        let list = [...getStoredPatients()];
        const doctors = getStoredDoctors();

        // Search (Name, email, phone, condition)
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          list = list.filter(
            (pat) =>
              pat.name.toLowerCase().includes(q) ||
              pat.condition.toLowerCase().includes(q) ||
              (pat.conditionCategory &&
                pat.conditionCategory.toLowerCase().includes(q)) ||
              (pat.email && pat.email.toLowerCase().includes(q)) ||
              (pat.phone && pat.phone.toLowerCase().includes(q)),
          );
        }

        // Filter: Condition category
        if (condition && condition !== "ALL") {
          list = list.filter(
            (p) =>
              p.conditionCategory?.toLowerCase() === condition.toLowerCase() ||
              p.condition?.toLowerCase().includes(condition.toLowerCase()),
          );
        }

        // Filter: Status
        if (status && status !== "ALL") {
          list = list.filter(
            (p) => p.status?.toLowerCase() === status.toLowerCase(),
          );
        }

        // Filter: Gender
        if (gender && gender !== "ALL") {
          list = list.filter(
            (p) => p.gender?.toLowerCase() === gender.toLowerCase(),
          );
        }

        // Filter: Doctor
        if (doctorId && doctorId !== "ALL") {
          list = list.filter((p) => p.doctorId === doctorId);
        }

        // Filter: Date-wise (Admission date or Created at)
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          list = list.filter(
            (p) => new Date(p.admissionDate || p.createdAt) >= start,
          );
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          list = list.filter(
            (p) => new Date(p.admissionDate || p.createdAt) <= end,
          );
        }

        // Attach doctor details
        list = list.map((pat) => {
          const doc = doctors.find((d) => d.id === pat.doctorId);
          return {
            ...pat,
            doctorName: doc ? doc.name : "Unassigned",
            doctorHospital: doc ? doc.hospital : "N/A",
            doctorSpecialization: doc ? doc.specialization : "N/A",
          };
        });

        // Sort
        list.sort((a, b) => {
          let valA = a[sortBy] || "";
          let valB = b[sortBy] || "";
          if (sortBy === "admissionDate" || sortBy === "createdAt") {
            valA = new Date(valA).getTime();
            valB = new Date(valB).getTime();
          } else if (typeof valA === "string") {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
          }
          if (valA < valB) return order === "asc" ? -1 : 1;
          if (valA > valB) return order === "asc" ? 1 : -1;
          return 0;
        });

        // Pagination
        const total = list.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const currentPage = Math.max(1, Math.min(page, totalPages));
        const startIndex = (currentPage - 1) * limit;
        const paginatedPatients = list.slice(startIndex, startIndex + limit);

        return {
          data: paginatedPatients,
          pagination: {
            total,
            totalPages,
            page: currentPage,
            limit,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
          },
        };
      },
    );
  },

  async getPatientsByDoctor(doctorId) {
    return fetchWithFallback(
      `/doctors/${doctorId}/patients`,
      { method: "GET" },
      () => {
        const patients = getStoredPatients();
        return patients.filter((p) => p.doctorId === doctorId);
      },
    );
  },

  async createPatient(data) {
    return fetchWithFallback(
      "/patients",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      () => {
        const patients = getStoredPatients();
        if (!data.name || !data.condition) {
          throw new Error("Patient name and condition are required.");
        }
        const newPatient = {
          id: `pat_${Date.now()}`,
          name: data.name.trim(),
          age: Number(data.age) || 30,
          gender: data.gender || "Other",
          doctorId: data.doctorId || null,
          condition: data.condition.trim(),
          conditionCategory: data.conditionCategory || "General",
          status: data.status || "Active",
          phone: data.phone?.trim() || "",
          email: data.email?.trim() || "",
          admissionDate:
            data.admissionDate || new Date().toISOString().split("T")[0],
          createdAt: new Date().toISOString(),
          notes: data.notes || "",
        };
        const updated = [newPatient, ...patients];
        saveStoredPatients(updated);
        return newPatient;
      },
    );
  },

  async updatePatient(id, data) {
    return fetchWithFallback(
      `/patients/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      () => {
        const patients = getStoredPatients();
        const index = patients.findIndex((p) => p.id === id);
        if (index === -1) throw new Error("Patient not found");

        const updatedPatient = {
          ...patients[index],
          ...data,
          id, // preserve ID
        };
        patients[index] = updatedPatient;
        saveStoredPatients(patients);
        return updatedPatient;
      },
    );
  },

  async deletePatient(id) {
    return fetchWithFallback(`/patients/${id}`, { method: "DELETE" }, () => {
      const patients = getStoredPatients();
      const updated = patients.filter((p) => p.id !== id);
      saveStoredPatients(updated);
      return { success: true, id };
    });
  },

  // ---------------- DASHBOARD ANALYTICS ----------------
  async getDashboardAnalytics() {
    const [statsRes, doctorsRes, monthlyRes] = await Promise.all([
      apiRequest("/dashboard/stats"),
      apiRequest("/dashboard/patients-per-doctor"),
      apiRequest("/dashboard/patients-by-month"),
    ]);

    const stats = statsRes.stats || {};

    const totalDoctors = stats.totalDoctors || 0;
    const totalPatients = stats.totalPatients || 0;

    const avgPatientsPerDoctor =
      totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : 0;

    // Patients per Doctor
    const patientsPerDoctor = (doctorsRes.patientsPerDoctor || []).map(
      (doctor) => ({
        id: doctor._id,
        name: doctor.name.replace(/^Dr\.\s*/i, ""),
        specialization: doctor.specialization,
        hospital: doctor.hospital,
        patientCount: doctor.totalPatients,
      }),
    );

    // Condition Distribution
    const conditionDistribution = (statsRes.patientsByCategory || []).map(
      (category) => ({
        name: category._id || "General",
        value: category.count,
      }),
    );

    // Monthly Admissions
    const monthlyAdmissions = (monthlyRes.patientsByMonth || []).map((item) => {
      const [year, month] = item.month.split("-");

      const monthName = new Date(
        Number(year),
        Number(month) - 1,
      ).toLocaleString("en-US", { month: "short" });

      return {
        month: monthName,
        admissions: item.totalPatients,
        discharges: 0,
      };
    });

    return {
      totalDoctors,
      totalPatients,
      avgPatientsPerDoctor,
      criticalCases: stats.criticalPatients || 0,
      activeCases: stats.activePatients || 0,
      inTreatmentCases: stats.inTreatmentPatients || 0,
      recoveredCases: stats.recoveredPatients || 0,
      patientsPerDoctor,
      conditionDistribution,
      monthlyAdmissions,
      recentPatients: statsRes.recentPatients || [],
    };
  },
};

