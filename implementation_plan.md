# Portfolio Website — Product Requirements & Implementation Plan (v4)

**For:** Virendra Kumar | Full Stack Developer  
**Frontend Stack:** React.js + Vite + Vanilla CSS (Glassmorphism design)  
**Backend Stack:** Node.js + Express.js + MongoDB Atlas  
**Major Change:** Transitioned from Vanilla HTML/JS frontend to a React + Vite application under `/client` with Express serving built assets in production.

---

## 1. Executive Summary

We are building a **MERN stack portfolio website** for **Virendra Kumar**. The project is split into:
1. **Frontend (`client/`)** — Built with React + Vite, incorporating React Router for page routing (Public Portfolio at `/` and Admin Dashboard at `/admin`). Uses a beautiful Glassmorphism design styled via Vanilla CSS.
2. **Backend (`server/`)** — Node.js/Express REST API connecting to MongoDB Atlas, handling authentication (JWT), portfolio data CRUD, and file uploads.
3. **Workspace Root** — Configuration to manage both client and server concurrently during development.

---

## 2. Directory Structure

```
my-portfolio/
├── package.json             # Root package.json (concurrently / cross-env script runner)
├── server/                  # Backend code
│   ├── package.json
│   ├── server.js            # Express server entry point
│   ├── config/
│   │   └── db.js            # Mongoose / MongoDB connection
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/              # Mongoose schemas (Profile, Project, Skill, Experience, etc.)
│   ├── routes/              # Express API endpoints
│   └── seed.js              # Database seeding script
├── client/                  # Frontend code
│   ├── package.json
│   ├── vite.config.js       # Vite configuration
│   ├── index.html
│   └── src/
│       ├── main.jsx         # App bootstrap
│       ├── App.jsx          # Route management & global state
│       ├── index.css        # Global CSS variables & layout definitions
│       ├── components/      # Reusable UI elements (GlassCard, StatusBadge, Navbar, Toasts, etc.)
│       └── pages/           # High-level pages (Portfolio, AdminLogin, AdminDashboard)
└── seed-data.json           # Seed data sourced from resume
```

---

## 3. User Review Required

> [!IMPORTANT]
> **React + Vite Adoption:** The frontend is now a single-page React app powered by Vite. Development runs client on port 5173 and server on port 5000, with a proxy setup in Vite. In production, the React app is built into static assets (`client/dist`) and served by the Express server.
>
> **Glassmorphism Theme:** All UI cards, buttons, lists, and input fields will use frosted-glass CSS styling with backdrop blur and customizable neon purple/indigo borders.

---

## 4. Open Questions

> [!IMPORTANT]
> 1. **Social URLs:** Please provide your GitHub, LinkedIn, and LeetCode links so they can be seeded.
> 2. **Project Demo Links:** Do you have live demo or GitHub links for CraftCurio and QuickHire?
> 3. **Admin Credentials:** What email address and password would you like to set for the Admin login?
> 4. **"Open to Work" Badge:** Should this badge be active by default?

---

## 5. Proposed Changes

### Component 1: Workspace Root Setup
- Configure `package.json` to handle installation and execution commands.
- Run `npm install concurrently cross-env --save-dev` in root directory.

### Component 2: Express Backend (`server/`)
- Set up models, database configurations, routing paths, and authentication middleware.
- Connect to MongoDB Atlas using `mongoose`.
- Build seeding logic.

### Component 3: React Frontend (`client/`)
- Initialize a React app using Vite (`npm create vite@latest client --template react`).
- Add routing using `react-router-dom`.
- Build reusable UI components styled with glassmorphism CSS.
- Connect dynamic components to backend API services.

---

## 6. Verification Plan

### Development Command Checks
```bash
# Install all root dependencies
npm install

# Run client & server concurrently
npm run dev

# Run database seed
npm run seed
```

### Manual Verification Checklist
1. **Dynamic Landing Page:** Check that `/` renders all sections using dynamic data from the database.
2. **Interactive Glassmorphism Effects:** Test spotlight cursor follower, card translations, hover triggers, active sections tracking.
3. **Protected Login:** Visit `/admin` and confirm redirect to login if JWT is absent.
4. **Dashboard CRUD Operations:** Confirm additions, modifications, and deletions of skills, projects, certificates, and experiences are updated on the client page immediately or on refresh.
5. **Resume & File Uploads:** Upload file assets, verify storage inside `server/uploads/`, and confirm downloadable status.
