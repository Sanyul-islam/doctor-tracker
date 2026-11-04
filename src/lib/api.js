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
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.AUTH) : null;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${res.status} ${res.statusText}`);
      }

      return await res.json();
    } catch (err) {
      console.warn(`[DoctorTracker API] Real endpoint ${endpoint} failed, falling back to mock adapter:`, err.message);
      // Fallback to mock handler if backend isn't up
      return await mockHandler();
    }
  }

  // Artificial short delay to simulate network latency realistically in mock mode
  await new Promise((resolve) => setTimeout(resolve, 80));
  return await mockHandler();
}

export const api = {
  // Reset data to default seed
  resetData: () => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
  },

  // ---------------- AUTH ----------------
  async login({ email, password }) {
    return fetchWithFallback(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
      () => {
        // Mock authentication check
        if (!email || !password) {
          throw new Error("Email and password are required");
        }
        if (password.length < 4) {
          throw new Error("Password must be at least 4 characters");
        }
        const user = {
          id: "usr_admin",
          name: "Dr. Evelyn Reed",
          role: "System Administrator",
          email: email.toLowerCase(),
          avatar: "ER",
          token: "mock-jwt-token-" + Date.now(),
        };
        return { success: true, user, token: user.token };
      }
    );
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

    return fetchWithFallback(`/doctors?${params.toString()}`, { method: "GET" }, () => {
      let list = [...getStoredDoctors()];
      const patients = getStoredPatients();

      // Search (Name, email, specialization, hospital, phone)
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        list = list.filter(
          (doc) =>
            doc.name.toLowerCase().includes(q) ||
            doc.specialization.toLowerCase().includes(q) ||
            doc.hospital.toLowerCase().includes(q) ||
            doc.email.toLowerCase().includes(q) ||
            (doc.phone && doc.phone.toLowerCase().includes(q))
        );
      }

      // Filter: Specialization
      if (specialization && specialization !== "ALL") {
        list = list.filter((doc) => doc.specialization.toLowerCase() === specialization.toLowerCase());
      }

      // Filter: Hospital
      if (hospital && hospital !== "ALL") {
        list = list.filter((doc) => doc.hospital.toLowerCase() === hospital.toLowerCase());
      }

      // Filter: Date-wise (Created at range)
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        list = list.filter((doc) => new Date(doc.createdAt) >= start);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        list = list.filter((doc) => new Date(doc.createdAt) <= end);
      }

      // Attach dynamic patient counts
      list = list.map((doc) => ({
        ...doc,
        patientsCount: patients.filter((p) => p.doctorId === doc.id).length,
      }));

      // Sort
      list.sort((a, b) => {
        let valA = a[sortBy] || "";
        let valB = b[sortBy] || "";
        if (sortBy === "createdAt") {
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
      const paginatedDoctors = list.slice(startIndex, startIndex + limit);

      return {
        data: paginatedDoctors,
        pagination: {
          total,
          totalPages,
          page: currentPage,
          limit,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      };
    });
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
        if (!data.name || !data.specialization || !data.hospital || !data.phone || !data.email) {
          throw new Error("All fields (Name, Specialization, Hospital, Phone, Email) are required.");
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
      }
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
      }
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
        p.doctorId === id ? { ...p, doctorId: null } : p
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

    return fetchWithFallback(`/patients?${params.toString()}`, { method: "GET" }, () => {
      let list = [...getStoredPatients()];
      const doctors = getStoredDoctors();

      // Search (Name, email, phone, condition)
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        list = list.filter(
          (pat) =>
            pat.name.toLowerCase().includes(q) ||
            pat.condition.toLowerCase().includes(q) ||
            (pat.conditionCategory && pat.conditionCategory.toLowerCase().includes(q)) ||
            (pat.email && pat.email.toLowerCase().includes(q)) ||
            (pat.phone && pat.phone.toLowerCase().includes(q))
        );
      }

      // Filter: Condition category
      if (condition && condition !== "ALL") {
        list = list.filter((p) =>
          p.conditionCategory?.toLowerCase() === condition.toLowerCase() ||
          p.condition?.toLowerCase().includes(condition.toLowerCase())
        );
      }

      // Filter: Status
      if (status && status !== "ALL") {
        list = list.filter((p) => p.status?.toLowerCase() === status.toLowerCase());
      }

      // Filter: Gender
      if (gender && gender !== "ALL") {
        list = list.filter((p) => p.gender?.toLowerCase() === gender.toLowerCase());
      }

      // Filter: Doctor
      if (doctorId && doctorId !== "ALL") {
        list = list.filter((p) => p.doctorId === doctorId);
      }

      // Filter: Date-wise (Admission date or Created at)
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        list = list.filter((p) => new Date(p.admissionDate || p.createdAt) >= start);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        list = list.filter((p) => new Date(p.admissionDate || p.createdAt) <= end);
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
    });
  },

  async getPatientsByDoctor(doctorId) {
    return fetchWithFallback(`/doctors/${doctorId}/patients`, { method: "GET" }, () => {
      const patients = getStoredPatients();
      return patients.filter((p) => p.doctorId === doctorId);
    });
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
          admissionDate: data.admissionDate || new Date().toISOString().split("T")[0],
          createdAt: new Date().toISOString(),
          notes: data.notes || "",
        };
        const updated = [newPatient, ...patients];
        saveStoredPatients(updated);
        return newPatient;
      }
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
      }
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
    return fetchWithFallback("/analytics/dashboard", { method: "GET" }, () => {
      const doctors = getStoredDoctors();
      const patients = getStoredPatients();

      const totalDoctors = doctors.length;
      const totalPatients = patients.length;
      const avgPatientsPerDoctor = totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : 0;

      // Patients per Doctor chart data
      const patientsPerDoctor = doctors.map((doc) => {
        const count = patients.filter((p) => p.doctorId === doc.id).length;
        return {
          id: doc.id,
          name: doc.name.replace("Dr. ", ""),
          specialization: doc.specialization,
          hospital: doc.hospital,
          patientCount: count,
        };
      }).sort((a, b) => b.patientCount - a.patientCount);

      // Condition category distribution
      const conditionMap = {};
      patients.forEach((p) => {
        const cat = p.conditionCategory || "Other";
        conditionMap[cat] = (conditionMap[cat] || 0) + 1;
      });
      const conditionDistribution = Object.keys(conditionMap).map((key) => ({
        name: key,
        value: conditionMap[key],
      }));

      // Status breakdown
      const statusBreakdown = {
        Active: patients.filter((p) => p.status === "Active").length,
        "In Treatment": patients.filter((p) => p.status === "In Treatment").length,
        Recovered: patients.filter((p) => p.status === "Recovered").length,
        Critical: patients.filter((p) => p.status === "Critical").length,
      };

      // Monthly / Date-based trends (last 6 months)
      const monthNames = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
      const monthlyAdmissions = [
        { month: "May", admissions: 8, discharges: 5, doctorsAdded: 1 },
        { month: "Jun", admissions: 14, discharges: 9, doctorsAdded: 2 },
        { month: "Jul", admissions: 18, discharges: 11, doctorsAdded: 2 },
        { month: "Aug", admissions: 24, discharges: 16, doctorsAdded: 3 },
        { month: "Sep", admissions: 29, discharges: 19, doctorsAdded: 2 },
        { month: "Oct", admissions: 34, discharges: 24, doctorsAdded: 2 },
      ];

      // Hospital distribution
      const hospitalMap = {};
      doctors.forEach((d) => {
        hospitalMap[d.hospital] = (hospitalMap[d.hospital] || 0) + 1;
      });
      const hospitalDistribution = Object.keys(hospitalMap).map((h) => ({
        name: h,
        count: hospitalMap[h],
      }));

      return {
        totalDoctors,
        totalPatients,
        avgPatientsPerDoctor,
        criticalCases: statusBreakdown.Critical || 0,
        activeCases: statusBreakdown.Active || 0,
        inTreatmentCases: statusBreakdown["In Treatment"] || 0,
        recoveredCases: statusBreakdown.Recovered || 0,
        patientsPerDoctor,
        conditionDistribution,
        statusBreakdown,
        monthlyAdmissions,
        hospitalDistribution,
        recentPatients: patients.slice(0, 5),
      };
    });
  },
};

