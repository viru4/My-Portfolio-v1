# Project Roadmap & Implementation Schedule

**Authored by:** Senior Full-Stack Engineer & Project Manager  
**Companion to:** [Implementation Plan](file:///c:/Users/Lenovo/OneDrive/Desktop/my-portfolio/implementation_plan.md) and [Technical Requirements Document (TRD)](file:///c:/Users/Lenovo/OneDrive/Desktop/my-portfolio/technical_requirements_document.md)

This document maps out a phased engineering schedule. Each phase outlines specific development tasks, targeted source files, and concrete verification deliverables.

---

## Phase 1: Environment & Workspace Setup
**Objective:** Standardize the workspace environment, initialize local repositories, and install common package dependencies.

### Tasks
1. Initialize Git in the project root directory. Setup a `.gitignore` blocking `node_modules`, `.env`, and local `uploads/` directories.
2. Create two directories: `client/` and `server/`.
3. In the project root, create a `package.json` file. Install `concurrently` and `cross-env` to orchestrate parallel script operations during development.
4. Run standard React + Vite template creator inside `client/` to configure the React shell (`npm create vite@latest client --template react`).
5. Configure `vite.config.js` to proxy `/api` calls to `http://localhost:5000`.
6. Initialize the Node server in the `server/` directory. Initialize `package.json` and install Express, dotenv, cors, and helmet.

### Deliverables
- **Workable Monorepo Shell:** Root workspace that executes both Express and Vite frontend servers on a single console command (`npm run dev`).
- **Proxy Verification:** Verification that requests sent to `localhost:5173/api/test` reach `localhost:5000/api/test`.

---

## Phase 2: Database Initialization & Seeding
**Objective:** Connect the application to MongoDB Atlas, compile Mongoose schemas, and construct dynamic seed functions.

### Tasks
1. Set up a MongoDB Atlas Cluster (M0 Free Tier). Add cluster access credentials to `server/.env`.
2. Construct the database client connector logic inside `server/config/db.js`.
3. Write Mongoose schemas for all 8 collections (Admin, Profile, Project, Skill, Experience, Education, Certification, Social).
4. Create the `server/seed.js` script. Include code that drops active content collections and populates default resume data from `seed-data.json`.

### Deliverables
- **Seeded DB Instance:** Verified MongoDB collections populated with resume parameters.
- **Auditing Schemas:** Verification that Mongoose default timestamps (`createdAt`, `updatedAt`) populate on document creation.

---

## Phase 3: Authentication & Security Controls
**Objective:** Implement JWT validation middleware, secure password hashing, and login controllers.

### Tasks
1. Install `bcryptjs` and `jsonwebtoken` dependencies.
2. Build JWT token signature function and verification middleware (`protectRoute`).
3. Build the `/api/auth/login` endpoint to validate admin inputs against stored database hashes.
4. Build the `/api/auth/verify` endpoint to check token health on page reload.

### Deliverables
- **Auth Endpoint Suite:** Postman-verifiable or fetch-verifiable authentication path returning a 24-hour token.
- **Route Guards:** Verify that unauthorized calls to `/api/projects` (POST) return `401 Unauthorized`.

---

## Phase 4: Core CSS & Styling Blueprint
**Objective:** Establish design system tokens, layout grids, global resets, and the base Glassmorphism card template.

### Tasks
1. Create `client/src/index.css`. Code variables for dark backgrounds, neon accents, font mappings, and timing transforms.
2. Build the basic `.glass-card` CSS style utilizing backdrop-blur, transparent gradients, and inset lighting styles.
3. Code responsive styling targets: two-column screen split for desktops, stacking rows for mobile devices.

### Deliverables
- **Unified Style Sheet:** Global style definitions loaded at the entry point of the React frontend.
- **Layout Shell:** A structural mock layout confirming glass card backdrop blur is fully rendering in-browser.

---

## Phase 5: Public Portfolio Feature Engineering
**Objective:** Build out individual sections of the public landing page, hook up dynamic data fetches, and program interactive animations.

### Tasks
1. Assemble layout panels: Left sidebar info panel and right-side scroll wrapper.
2. Code React UI components for the main sections: About, Experience, Projects, Skills, Education, and Contact.
3. Build custom hooks (e.g. `useFetchPortfolio`) to bundle API requests inside single `Promise.all()` triggers on mount.
4. Set up an Intersection Observer hook to toggle navigation indicators as sections cross the user's viewport.
5. Add the mousemove-tracking spotlight shadow script and custom drifting particle canvas background.

### Deliverables
- **Functional Portfolio Site:** Frontend landing page displaying all CV details pulled directly from the API.
- **Dynamic Nav System:** Nav dot updates tracking scroll height with scroll progress markers.

---

## Phase 6: Admin Dashboard Core UI & Workspace Router
**Objective:** Establish navigation layouts inside the admin workspace, design responsive edit modals, and construct route-level access guards.

### Tasks
1. Set up React Router structures. Guard access to `/admin` routes (redirect users to `/admin/login` modal if JWT is missing).
2. Code the Admin layout template, sidebar tabs, and dynamic editor canvas workspace.
3. Construct modal popup managers to contain data addition and editing forms.
4. Write a global dynamic Toast Context Provider to show glass-styled notifications.

### Deliverables
- **Guarded Admin Shell:** Verified URL security redirecting unsigned users.
- **Workspace Navigation:** Smooth view switches between admin panels without page refreshes.

---

## Phase 7: Admin CRUD Operations & File Upload System
**Objective:** Program MERN API route modifications, form inputs, dynamic tag lists, and media file uploads.

### Tasks
1. Create API edit and deletion routes (`PUT`, `DELETE`) for profile, experience, projects, skills, and certifications.
2. Code the react CRUD form fields: Title inputs, bullet-lists managers, order counters, and checkmark toggles.
3. Setup `multer` middleware inside `server/routes/resume.js` to process PDF and image uploads. Write code to write files safely to `server/uploads/` directory.

### Deliverables
- **MERN CMS Console:** Complete editing capability for every section. Saving forms updates the portfolio dynamically.
- **Asset Upload Verification:** Uploaded thumbnails and resume PDFs appear in the server directory and link correctly to corresponding data documents.

---

## Phase 8: Testing & Diagnostics
**Objective:** Execute integration routines, verify security policies, audit Lighthouse compliance, and handle errors.

### Tasks
1. Verify Express API error handling is active. Ensure database connection drops do not crash the Node runtime.
2. Audit responsive views on iOS and Android virtual targets. Verify form interactive scopes on tablet screens.
3. Measure performance metrics (Lighthouse performance target of 90+, accessibility target of 95+).

### Deliverables
- **Lighthouse Performance Reports:** Passing grades on speed, accessibility, and SEO structure.
- **Security Checklists:** Verification that input forms block SQL/NoSQL injection patterns and sanitise parameters.

---

## Phase 9: Deployment Configuration & Release
**Objective:** Compile production builds, establish build environment flags, and deploy to hosting platforms.

### Tasks
1. Setup package build scripts to compile React files into `client/dist`.
2. Configure `server/server.js` static routes to mount `dist` files and handle fallback routing.
3. Configure Railway or Render configuration declarations (`render.yaml`).
4. Perform live environment variables injection (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, etc.).

### Deliverables
- **Live Production App:** Fully operational deployed URL serving MERN endpoints and the React frontend securely.
- **Deployment Document:** Complete configuration records saved to [README.md](file:///c:/Users/Lenovo/OneDrive/Desktop/my-portfolio/README.md).
