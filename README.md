# 🌌 Virendra Kumar — Premium MERN Portfolio & CMS

A production-ready, full-stack MERN portfolio with a **Glassmorphic** UI and secure **Admin CMS Dashboard** for managing projects, skills, experience, education, certifications, and resume uploads.

---

## 🚀 Key Features

* **Glassmorphic UI/UX** — indigo-violet accents, particles, scroll progress, responsive split-column layout
* **Admin CMS** — full CRUD for profile, projects, skills, experience, education, certifications, social links, and resume PDF
* **Project Pinning** — feature up to 3 standard + 2 ML projects on the homepage
* **JWT Authentication** — stateless admin auth with rate limiting
* **Production Hardened** — health checks, graceful shutdown, Docker support, env validation, CSP headers

---

## 🛠 Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 19, Vite 8, React Router 7 |
| Backend | Express 4, Node.js 20 |
| Database | MongoDB Atlas (Mongoose) |
| Security | Helmet, CORS, bcrypt, JWT, rate limiting |

---

## ⚙️ Local Development

### Prerequisites

* Node.js **18+** (see `.nvmrc` — recommended: **20**)
* MongoDB Atlas cluster or local MongoDB

### 1. Install dependencies

```bash
npm install
npm run install-all
```

### 2. Configure environment

Copy the example env file and fill in your values:

```bash
cp server/.env.example server/.env
```

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio
JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=your_secure_password
ALLOWED_ORIGIN=http://localhost:5173
```

### 3. Seed the database

```bash
npm run seed
```

### 4. Start development servers

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Health check | http://localhost:5000/api/health |
| Admin login | http://localhost:5173/admin/login |

---

## 🚢 Production Deployment

### Pre-flight checklist

Before deploying, confirm:

- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` is at least **32 characters** (64+ recommended)
- [ ] `ALLOWED_ORIGIN` is set to your live domain (e.g. `https://yourdomain.com`)
- [ ] MongoDB Atlas allows connections from your host IP (or `0.0.0.0/0` for cloud PaaS)
- [ ] Frontend is built (`npm run build`) — the server serves `client/dist/`
- [ ] Database is seeded (`npm run seed`) with secure admin credentials

### Option A — Single command (VPS / bare metal)

```bash
npm install
npm run install-all
npm run build
npm run start
```

Or use the combined script:

```bash
npm run start:prod
```

The Express server serves both the API and the React static build on one port (default **5000**).

### Option B — Docker

```bash
# Build image
npm run docker:build

# Run container (requires server/.env with production values)
npm run docker:run
```

Or manually:

```bash
docker build -t virendra-portfolio .
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e MONGODB_URI="your_uri" \
  -e JWT_SECRET="your_64_char_secret" \
  -e ALLOWED_ORIGIN="https://yourdomain.com" \
  virendra-portfolio
```

Docker includes a built-in health check on `/api/health`.

### Option C — Render (PaaS)

1. Push repo to GitHub
2. Connect to [Render](https://render.com)
3. Use the included `render.yaml` blueprint, or create a **Web Service** with:
   * **Build command:** `npm install && npm run install-all && npm run build`
   * **Start command:** `npm run start`
   * **Health check path:** `/api/health`
4. Set environment variables in the Render dashboard:
   * `MONGODB_URI`, `JWT_SECRET`, `ALLOWED_ORIGIN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
5. After first deploy, run seed via Render shell: `npm run seed`

### Option D — Reverse proxy (Nginx)

When running behind Nginx or a load balancer, the server sets `trust proxy` automatically in production. Example Nginx config:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Use **Certbot** or your provider's TLS termination for HTTPS, then set `ALLOWED_ORIGIN=https://yourdomain.com`.

### Option E — PM2 (process manager for VPS)

```bash
npm install -g pm2
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Useful commands: `npm run pm2:start`, `npm run pm2:stop`, `pm2 logs portfolio`

---

## 🛡 Production Security

| Feature | Details |
|---------|---------|
| Env validation | Server refuses to start without `MONGODB_URI`, `JWT_SECRET`, `ALLOWED_ORIGIN` (prod) |
| JWT secret length | Minimum 32 chars enforced in production |
| Rate limiting | 200 req/15 min (API), 15 req/15 min (login) |
| Helmet | Security headers + CSP in production |
| CORS | Locked to `ALLOWED_ORIGIN` in production |
| Error masking | Stack traces hidden from API responses in production |
| Graceful shutdown | Handles SIGTERM/SIGINT (Docker, Render, systemd) |
| Non-root Docker | Container runs as unprivileged `nodejs` user |

---

## 📁 Project Structure

```text
my-portfolio/
├── client/                 # React frontend (Vite)
├── server/                 # Express API
│   ├── config/             # DB + env validation
│   ├── middleware/         # Auth, errors, validation
│   ├── models/             # Mongoose schemas
│   ├── routes/             # REST endpoints
│   ├── uploads/            # Resume PDF storage
│   └── .env.example        # Environment template
├── seed-data.json          # Default portfolio content
├── Dockerfile              # Production container
├── render.yaml             # Render.com blueprint
└── package.json            # Root scripts
```

---

## 📡 API Endpoints

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/health` | Public | Health check (used by Docker/Render) |
| GET | `/api/profile` | Public | Profile data |
| GET/POST/PUT/DELETE | `/api/projects` | Mixed | Project CRUD |
| GET/POST/PUT/DELETE | `/api/skills` | Mixed | Skills CRUD |
| GET/POST/PUT/DELETE | `/api/experience` | Mixed | Experience CRUD |
| GET/POST/PUT/DELETE | `/api/education` | Mixed | Education CRUD |
| GET/POST/PUT/DELETE | `/api/certifications` | Mixed | Certifications CRUD |
| GET/PUT | `/api/social` | Mixed | Social links |
| POST | `/api/resume/upload` | Private | Upload resume PDF |
| POST | `/api/auth/login` | Public | Admin login |
| GET | `/api/auth/verify` | Private | Verify JWT session |

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + backend in development |
| `npm run build` | Build React app to `client/dist/` |
| `npm run start` | Start production server |
| `npm run start:prod` | Build + start in one step |
| `npm run seed` | Populate database with default data |
| `npm run lint` | Run ESLint on frontend |
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run Docker container |
