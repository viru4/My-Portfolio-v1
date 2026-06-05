# Technical Requirements Document (TRD) — MERN Stack

**Project:** Virendra Kumar — React + Vite Portfolio with Admin CMS  
**Authored by:** Senior Software Architect  
**Companion to:** [Product Requirements Document & Implementation Plan](file:///c:/Users/Lenovo/OneDrive/Desktop/my-portfolio/implementation_plan.md)

---

## 1. System Architecture

### 1.1 Development Mode (Concurrent Services)
During development, the frontend and backend run as independent HTTP servers:
- **Frontend Development Server (Vite):** Runs on `http://localhost:5173`. Handles React HMR, styles, and assets.
- **Backend API Server (Express.js):** Runs on `http://localhost:5000`. Connects to MongoDB Atlas and local disk storage (`uploads/`).
- **Proxy Configuration:** Vite is configured to proxy all `/api` requests to the backend server.

```
+---------------------------------------+
|          Browser (Client)             |
|          localhost:5173               |
+---+-------------------------------+---+
    |                               ^
    | API Request (/api/*)          | Response
    v                               |
+---+-------------------------------+---+
|        Vite Development Proxy         |
|        localhost:5173                 |
+---+-------------------------------+---+
    |                               ^
    | Forwarded request             | Response
    v                               |
+---+-------------------------------+---+
|         Express.js API Server         |
|         localhost:5000                |
+---------------------------------------+
```

### 1.2 Production Mode (Monolith Build & Serve)
In production, the Vite frontend is pre-built into static files under `client/dist`, which are served directly by the Express.js app.
- **Express serves static assets:** `app.use(express.static('../client/dist'))`
- **Catch-All route:** All unrecognized HTML requests default to `client/dist/index.html` to support React Router's client-side navigation.

---

## 2. Frontend Stack Details

- **Core Library:** React.js 18.x / 19.x
- **Build & Dev Tooling:** Vite
- **Routing:** `react-router-dom` 6.x
- **State Management:** React local state (`useState`, `useContext` for auth/toasts)
- **Styling:** Vanilla CSS (Glassmorphism layout + dynamic interactions)
- **API Fetching:** Standard `fetch` API bundled in a custom custom react hook or service utility

---

## 3. Backend Stack Details

- **Runtime:** Node.js (v20+ LTS)
- **Framework:** Express.js 4.x
- **Database Connector:** Mongoose 8.x ODM
- **Authentication:** `jsonwebtoken` for stateless authentication + `bcryptjs` for single-admin password hashing
- **File Uploads:** `multer` (for resume PDF and project thumbnail uploads)

---

## 4. API endpoints

| Route | Method | Access | Description |
|---|---|---|---|
| `/api/auth/login` | `POST` | Public | Authenticates admin using email + password, returns JWT |
| `/api/auth/verify` | `GET` | Public | Validates incoming Authorization header JWT |
| `/api/profile` | `GET` / `PUT` | Public / Protected | Get or update tagline, name, about, status badge |
| `/api/projects` | `GET` / `POST` | Public / Protected | Get or create project entries |
| `/api/projects/:id` | `PUT` / `DELETE` | Protected | Update or delete existing project entries |
| `/api/skills` | `GET` / `POST` | Public / Protected | Get or manage skills categories |
| `/api/skills/:id` | `PUT` / `DELETE` | Protected | Modify or delete skills categories |
| `/api/experience` | `GET` / `POST` | Public / Protected | Get or manage experiences |
| `/api/experience/:id` | `PUT` / `DELETE` | Protected | Modify or delete experiences |
| `/api/education` | `GET` / `POST` | Public / Protected | Get or manage education entries |
| `/api/education/:id` | `PUT` / `DELETE` | Protected | Modify or delete education entries |
| `/api/certifications` | `GET` / `POST` | Public / Protected | Get or manage certifications |
| `/api/certifications/:id`| `PUT` / `DELETE` | Protected | Modify or delete certifications |
| `/api/social` | `GET` / `PUT` | Public / Protected | View or update links |
| `/api/resume/upload` | `POST` | Protected | Upload resume PDF |
| `/api/resume/download` | `GET` | Public | Serve the current PDF resume file |
