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
    return apiRequest(`/doctors/${id}`);
  },

  async createDoctor(data) {
    // 1. Validate and clean form data
    const doctorData = {
      name: data.name?.trim(),
      specialization: data.specialization?.trim(),
      hospital: data.hospital?.trim(),
      phone: data.phone?.trim(),
      email: data.email?.trim(),
    };

    // 2. Validate required fields
    if (
      !doctorData.name ||
      !doctorData.specialization ||
      !doctorData.hospital ||
      !doctorData.phone ||
      !doctorData.email
    ) {
      throw new Error(
        "All fields (Name, Specialization, Hospital, Phone, Email) are required.",
      );
    }

    // 3. Send data to backend
    return apiRequest("/doctors", {
      method: "POST",
      body: JSON.stringify(doctorData),
    });
  },

  async updateDoctor(id, data) {
    if (!id) {
      throw new Error("Doctor ID is required");
    }

    return apiRequest(`/doctors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteDoctor(id) {
    if (!id) {
      throw new Error("Doctor ID is required");
    }

    return apiRequest(`/doctors/${id}`, {
      method: "DELETE",
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
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search);
    if (condition !== "ALL") {
      params.set("conditionCategory", condition);
    }
    if (status !== "ALL") params.set("status", status);
    if (gender !== "ALL") params.set("gender", gender);
    if (doctorId !== "ALL") params.set("doctorId", doctorId);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("sortBy", sortBy);
    params.set("order", order);

    return apiRequest(`/patients?${params.toString()}`);
  },

  async getPatientsByDoctor(doctorId) {
    if (!doctorId) {
      throw new Error("Doctor ID is required");
    }

    return apiRequest(`/doctors/${doctorId}/patients`, {
      method: "GET",
    });
  },

  async createPatient(data) {
    const name = data.name?.trim();
    const condition = data.condition?.trim();

    if (!name || !condition) {
      throw new Error("Patient name and condition are required.");
    }

    const patientData = {
      ...data,
      name,
      condition,
    };

    return apiRequest("/patients", {
      method: "POST",
      body: JSON.stringify(patientData),
    });
  },

  async updatePatient(id, data) {
    if (!id) {
      throw new Error("Patient ID is required");
    }

    return apiRequest(`/patients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deletePatient(id) {
    if (!id) {
      throw new Error("Patient ID is required");
    }

    return apiRequest(`/patients/${id}`, {
      method: "DELETE",
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

