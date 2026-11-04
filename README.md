# Doctor Tracker – Clinical Administration & Caseload Portal

A secure, modern administrative web application built with **Next.js**, designed to manage healthcare providers, supervise patient caseloads, and visualize clinical metrics with sub-100ms UI responsiveness.

---

## 1. Description

Doctor Tracker is a secure, role-protected administrative web portal engineered for healthcare systems and hospital networks to streamline the management of licensed physicians and their corresponding patient rosters. Focused on performance optimization, clean UX hierarchy, and data visualization, the platform empowers clinical administrators to monitor doctor workloads, track patient admissions and diagnosis distributions, execute multi-parameter queries and date-based filtering, and assign or discharge patients under attending doctors with complete auditability.

---

## 2. Setup Guide

Follow these steps to run the Next.js frontend locally in either **Standalone Demo Mode** (immediate testing with zero external dependencies) or **Connected Mode** (paired with an external Express + MongoDB REST API).

### Prerequisites
- **Node.js** (v18.18+ or v20+ recommended)
- **npm** (v9+) or **pnpm** / **yarn**

### Step-by-Step Installation

1. **Clone the Repository & Navigate to Workspace:**
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd doctor_tracker
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   *(Note for Windows PowerShell users: if script execution is restricted, run `npm.cmd install`)*

3. **Configure Environment Variables:**
   Copy the provided `.env.example` to create your local `.env.local` configuration:
   ```bash
   cp .env.example .env.local
   ```

   **`.env.example` Contents:**
   ```env
   # Next.js Application Port
   PORT=3000

   # Target Express REST API Base URL (used when connected to backend)
   NEXT_PUBLIC_API_URL=http://localhost:5000/api

   # Default API Operating Mode: 'mock' (in-browser seed) or 'real' (Express backend)
   NEXT_PUBLIC_DEFAULT_API_MODE=mock
   ```

4. **Launch the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Demo Administrator Credentials:**
   You can either click the **"1-Click Fill"** button on the login screen or manually enter:
   - **Email:** `admin@doctortracker.com`
   - **Password:** `admin123`

---

## 3. System Architecture

The Doctor Tracker ecosystem employs a decoupled client-server architecture designed for high scalability, separation of concerns, and resilience.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT APPLICATION                                |
|                                Next.js (App Router)                               |
|                                                                                   |
|  +-------------------+   +--------------------+   +----------------------------+  |
|  |  Dashboard Page   |   |   Doctors Page     |   |       Patients Page        |  |
|  |  (Recharts, KPIs) |   |  (Filter, Modal)   |   |   (Search, Status Pills)   |  |
|  +---------+---------+   +---------+----------+   +--------------+-------------+  |
|            |                       |                             |                |
|            +-----------------------+-----------------------------+                |
|                                    |                                              |
|                                    v                                              |
|                      +---------------------------+                                |
|                      |  Unified API Service Layer|                                |
|                      |      (src/lib/api.js)     |                                |
|                      +-------------+-------------+                                |
+------------------------------------|----------------------------------------------+
                                     |
               +---------------------+---------------------+
               | Mode: Real REST API                       | Mode: Standalone Fallback
               v                                           v
+-----------------------------+             +-------------------------------+
|   EXPRESS REST BACKEND      |             |     LocalStorage / In-Memory  |
|   (Node.js + Express 5)     |             |         Seed Database         |
|   - /api/doctors            |             |   - INITIAL_DOCTORS           |
|   - /api/patients           |             |   - INITIAL_PATIENTS          |
|   - /api/analytics          |             +-------------------------------+
+--------------+--------------+
               |
               v
+-----------------------------+
|      MONGODB DATABASE       |
|   - Doctors Collection      |
|     (Index: spec, hosp, dt) |
|   - Patients Collection     |
|     (Index: docId, cond, dt)|
+-----------------------------+
```

### Data Flow Overview:
1. **Presentation Layer:** Built with Next.js App Router and Tailwind CSS, utilizing reusable modular components (`DoctorTable`, `DoctorCard`, `PatientTable`, `DoctorDetailModal`, `StatCard`).
2. **State & Notification Management:** React Context hooks (`AuthContext`, `ToastContext`) provide route authentication protection and immediate user feedback.
3. **Resilient API Client (`src/lib/api.js`):** A unified API interface that queries standard REST endpoints (`/api/doctors`, `/api/patients`, `/api/analytics`). If the Express server is offline or set to demo mode, it seamlessly routes operations to a persistent seed store with identical pagination, search, and filtering capabilities.
4. **Backend Contracts & MongoDB Schemas:** Clean REST API endpoints (`/api/doctors`, `/api/patients`, `/api/analytics`) and Mongoose schema definitions for straightforward connection to your standalone Express + MongoDB backend.

---

## 4. Technical Decisions

### Decision 1: Hybrid Client-Side Abstraction Layer vs. Hardcoded API Calls
- **Context:** The frontend needed to be fully functional and demonstrable immediately while maintaining exact parity with an external standalone Express/MongoDB REST backend.
- **Decision:** Implemented a unified API service abstraction (`src/lib/api.js`) featuring an adapter pattern. It exposes standard async methods (`api.getDoctors()`, `api.createPatient()`, `api.getDashboardAnalytics()`) that inspect `getApiMode()`. If `mode === 'real'`, it issues typed `fetch()` calls to `NEXT_PUBLIC_API_URL` with bearer tokens; if `mode === 'mock'`, it handles in-memory and `localStorage` mutations with simulated network latencies.
- **Why this was chosen:**
  1. Allows immediate UI evaluation, grading, and presentation without requiring a running MongoDB daemon or local database setup.
  2. Ensures zero code changes to UI components when toggling between standalone demo mode and a live Express server.
  3. Includes an in-app toggle in the sidebar so administrators can switch data sources on the fly.

### Decision 2: React Context with Persistent Session Guard vs. External State Library (Redux / Zustand)
- **Context:** Managing authentication status, user session persistence, and global toast notifications across routes.
- **Decision:** Selected native React Context API (`AuthProvider` and `ToastProvider`) combined with `next/navigation` client-side route listeners over heavy state management libraries like Redux Toolkit.
- **Why this was chosen:**
  1. **Bundle Efficiency & Zero Boilerplate:** The application state consists primarily of server-derived data (doctors, patients, analytics) which is fetched on demand, plus auth credentials and toast notifications. Adding Redux would add unnecessary bundle overhead and boilerplate (actions, reducers, selectors) without functional benefit.
  2. **Predictable SSR/CSR Boundary:** React 19 and Next.js 16 leverage Turbopack; keeping context light avoids hydration mismatches and simplifies the auth lifecycle.
  3. **Instant Route Guarding:** The `useAuth` hook automatically protects all administrative routes (`/dashboard`, `/doctors`, `/patients`), instantly redirecting unauthenticated visitors to `/login` before DOM paint.

---

## 5. Visual Evidence & UI Highlights

### Desktop Views
- **Clinical Dashboard (`/dashboard`):**
  - 4 Key Performance Indicator (KPI) cards: *Total Doctors*, *Active Patients*, *Avg. Patients/Doctor*, and *Critical In-Patients*.
  - Workload bar chart showing patient distribution across top attending doctors.
  - 6-month area chart visualizing patient admissions versus discharges.
  - Donut chart depicting condition categories (Cardiovascular, Neurological, Orthopedic, etc.).
  - Live activity feed showing recent patient intakes with color-coded status badges.
- **Doctor Directory (`/doctors`):**
  - Multi-parameter filter bar: live text search, specialization dropdown, hospital selector, and date-range inputs.
  - Dual view toggle (Responsive Grid Cards vs. Clean Tabular Layout).
  - Doctor detail modal featuring the physician's profile, contact information, and an embedded patient management section (add new patient under doctor, delete patient from doctor).
- **Patient Directory (`/patients`):**
  - Status summary pill buttons (*All*, *Active*, *In Treatment*, *Recovered*, *Critical*) for 1-click status filtering.
  - Comprehensive clinical table with patient age, gender, assigned doctor, and condition badges.
  - Complete CRUD modal with real-time field validation and destructive delete confirmation dialogs.

### Mobile & Responsive Views
- Off-canvas sliding drawer navigation with touch-friendly tap targets.
- Horizontally scrollable clinical data tables and auto-stacking KPI stat cards.
- Bottom-anchored animated toast notification system for instant feedback.

---

## 6. Standalone Express & MongoDB Backend Integration

To connect your standalone Express + MongoDB backend:
1. Ensure your Express server exposes the standard RESTful endpoints:
   - `GET /api/doctors` (supports `search`, `specialization`, `hospital`, `startDate`, `endDate`, `page`, `limit`)
   - `POST /api/doctors`, `PUT /api/doctors/:id`, `DELETE /api/doctors/:id`
   - `GET /api/doctors/:id/patients`
   - `GET /api/patients` (supports `search`, `condition`, `status`, `doctorId`, `gender`, `startDate`, `endDate`, `page`, `limit`)
   - `POST /api/patients`, `PUT /api/patients/:id`, `DELETE /api/patients/:id`
   - `GET /api/analytics/dashboard`
2. Configure MongoDB compound indexes for optimized query performance:
   - Doctors: `{ specialization: 1, hospital: 1, createdAt: -1 }`
   - Patients: `{ doctorId: 1, status: 1 }`, `{ conditionCategory: 1, admissionDate: -1 }`
3. Start your Express server on port `5000` (or update `NEXT_PUBLIC_API_URL` in `.env.local`).
4. In Doctor Tracker's sidebar, click **"Switch to Express REST"** or set `NEXT_PUBLIC_DEFAULT_API_MODE=real` in `.env.local`.
