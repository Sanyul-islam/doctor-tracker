
# 🏥 Doctor Tracker

A Full-Stack Doctor and Patient Management System

## 📌 Description

Doctor Tracker is a full-stack web application designed to simplify doctor and patient management through a centralized admin dashboard. It allows administrators to manage doctor records, register and monitor patients, assign patients to doctors, track patient conditions and treatment statuses, and visualize healthcare statistics through interactive charts. The application provides a secure authentication system and a responsive interface, making healthcare data management more organized, efficient, and accessible.

## 🌐 Live Demo

- **Frontend:** https://doctor-tracker-jet-nine.vercel.app
- **Backend API:** https://doctor-tracker-server-ebon.vercel.app

## ✨ Key Features

- Secure admin authentication.
- Dashboard with healthcare statistics and analytics.
- Complete Doctor Management (Create, Read, Update, Delete).
- Complete Patient Management (Create, Read, Update, Delete).
- Assign patients to doctors.
- Search, filter, and paginate doctor and patient records.
- Track patient conditions and treatment statuses.
- View doctor-specific patient information.
- Interactive charts for patient statistics and admissions.
- Responsive dashboard for desktop and mobile devices.
- MongoDB database integration.

## 🛠️ Technology Stack

### Frontend
- Next.js
- React
- JavaScript
- Tailwind CSS
- HeroUI
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Cookie Parser
- CORS

### Deployment
- Vercel (Frontend)
- Vercel (Backend)
- MongoDB Atlas / MongoDB

## ⚙️ Setup Guide

Follow these steps to run Doctor Tracker locally.

### Prerequisites

Make sure you have installed:

- Node.js (LTS version)
- npm
- Git
- MongoDB or a MongoDB Atlas account

### 1. Clone the Repositories

Clone the frontend repository:

```bash
git clone YOUR_FRONTEND_GITHUB_URL
cd doctor-tracker
```

Clone the backend repository separately:

```bash
git clone YOUR_BACKEND_GITHUB_URL
cd doctor_tracker_server
```

### 2. Backend Installation

Navigate to the backend directory:

```bash
cd doctor_tracker_server
```

Install dependencies:

```bash
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file in the backend root directory.

Use the following configuration:

```env
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/doctor_tracker

CLIENT_URL=http://localhost:3000

JWT_SECRET=your_secure_random_jwt_secret

NODE_ENV=development

ADMIN_NAME=Doctor Tracker Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
```

For MongoDB Atlas, replace the local MongoDB URI with your Atlas connection string.

### 4. Create the Admin Account

Run the admin seeding script:

```bash
npm run seed:admin
```

This creates the initial administrator account using the credentials configured in your backend `.env` file.

### 5. Start the Backend Server

```bash
npm run dev
```

The backend server will run at:

```text
http://localhost:5000
```

Health check endpoint:

```text
http://localhost:5000/
```

### 6. Frontend Installation

Open another terminal and navigate to the frontend project directory:

```bash
cd doctor-tracker
```

Install dependencies:

```bash
npm install
```

### 7. Configure Frontend Environment Variables

Create a `.env.local` file in the frontend root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For local development, this connects the frontend directly to the local backend.

**Note:** If you use the Next.js API rewrite configuration, make sure the API base URL matches that configuration.

### 8. Start the Frontend

```bash
npm run dev
```

Open your browser:

```text
http://localhost:3000
```

You can now log in using the admin credentials configured in the backend `.env` file.

---

## 🏗️ System Architecture

Doctor Tracker follows a client-server architecture. The Next.js frontend communicates with the Express.js backend, which handles authentication, business logic, API requests, and database operations.

### Architecture Overview

```text
          ┌──────────────────────┐
          │      Admin User      │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │   Next.js Frontend   │
          │                      │
          │  Dashboard           │
          │  Doctor Management   │
          │  Patient Management  │
          └──────────┬───────────┘
                     │
                     │ API Requests
                     ▼
          ┌──────────────────────┐
          │   Express.js API     │
          │                      │
          │  Authentication     │
          │  Middleware          │
          │  Controllers         │
          │  Routes              │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │    Mongoose ODM      │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │   MongoDB Database   │
          │                      │
          │  Admin Collection    │
          │  Doctors Collection  │
          │  Patients Collection │
          └──────────────────────┘
```

### Data Flow

1. The administrator interacts with the Next.js frontend.
2. The frontend sends HTTP requests to the Express.js API.
3. Next.js rewrites can forward frontend `/api` requests to the deployed backend.
4. Authentication middleware verifies the HTTP-only JWT cookie for protected endpoints.
5. Controllers process requests and execute database operations through Mongoose.
6. MongoDB stores and retrieves application data.
7. The backend returns JSON responses to the frontend.
8. The frontend updates dashboard statistics, charts, and management interfaces.

### Backend API Structure

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get authenticated admin |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/doctors` | Get all doctors |
| POST | `/api/doctors` | Create doctor |
| GET | `/api/doctors/:id` | Get doctor details |
| PATCH | `/api/doctors/:id` | Update doctor |
| DELETE | `/api/doctors/:id` | Delete doctor |
| GET | `/api/patients` | Get all patients |
| POST | `/api/patients` | Create patient |
| GET | `/api/patients/:id` | Get patient details |
| PATCH | `/api/patients/:id` | Update patient |
| DELETE | `/api/patients/:id` | Delete patient |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/dashboard/patients-per-doctor` | Patients per doctor |
| GET | `/api/dashboard/patients-by-month` | Monthly patient statistics |

**Note:** All doctor, patient, and dashboard endpoints require admin authentication.

---

## 🧠 Technical Decisions

### 1. HTTP-Only Cookie Authentication Instead of Local Storage

For authentication, I implemented JWT-based authentication using HTTP-only cookies instead of storing authentication tokens in localStorage.

**Why this approach?**

- HTTP-only cookies cannot be accessed directly through JavaScript.
- This reduces the risk of token theft through certain XSS attacks.
- Cookies are automatically included in requests when credentials are configured correctly.
- The backend validates the JWT token through authentication middleware.

The login process generates a JWT and stores it in an HTTP-only cookie. Protected routes verify the cookie before allowing access to application resources.

### 2. MongoDB with Mongoose for Data Management

I chose MongoDB with Mongoose because the application manages related healthcare records, including doctors, patients, and administrators.

**Why this approach?**

- MongoDB provides flexible document-based data storage.
- Mongoose provides schema validation and structured models.
- References allow patients to be associated with doctors.
- Population makes it easier to retrieve related doctor information with patient records.
- Indexing improves query performance for frequently filtered data.

This approach provides a flexible and maintainable database structure for doctor and patient management.

---

## 📸 Visual Evidence

The following screenshots demonstrate the application's user interface across desktop and mobile devices.

### Desktop View

#### Dashboard
![Doctor Tracker Dashboard Desktop](./screenshots/dashboard-desktop.png)

#### Doctor Management
![Doctor Management Desktop](./screenshots/doctors-desktop.png)

#### Patient Management
![Patient Management Desktop](./screenshots/patients-desktop.png)

### Mobile View

#### Mobile Dashboard
![Doctor Tracker Mobile Dashboard](./screenshots/dashboard-mobile.png)

#### Mobile Doctor Management
![Doctor Management Mobile](./screenshots/doctors-mobile.png)

#### Mobile Patient Management
![Patient Management Mobile](./screenshots/patients-mobile.png)



---

## 📁 Project Structure

### Frontend

```text
doctor-tracker/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── doctors/
│   │   ├── patients/
│   │   └── layout/
│   ├── context/
│   └── lib/
│       ├── api.js
│       └── mockData.js
├── .env.local
├── next.config.mjs
└── package.json
```

### Backend

```text
doctor_tracker_server/
├── scripts/
│   └── seedAdmin.js
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── server.js
├── .env
├── .env.example
└── package.json
```

---

## 🔐 Security

- Passwords are hashed using bcryptjs.
- JWT-based authentication protects private API endpoints.
- Authentication tokens are stored in HTTP-only cookies.
- CORS is configured to allow the authorized frontend origin.
- Environment variables are used for sensitive configuration.
- Protected routes require valid authentication.

**Important:** Never commit `.env` or `.env.local` files containing real credentials or secrets to GitHub.

---

## 🚀 Future Improvements

- Role-based access control.
- Advanced patient medical history.
- Appointment scheduling.
- Prescription management.
- Medical report uploads.
- More advanced analytics and reporting.
- Export patient and doctor records.

---

## 👨‍💻 Author

**Md. Sanyul Islam**

Full Stack Web Developer

- **GitHub:** https://github.com/Sanyul-islam
- **Portfolio:** https://sanyulislam.vercel.app/

---

## 📄 License

This project was developed for educational and portfolio purposes.
