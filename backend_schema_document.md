# Backend Schema & Database Architecture Document

**Authored by:** Senior Backend Engineer  
**Companion to:** [Technical Requirements Document (TRD)](file:///c:/Users/Lenovo/OneDrive/Desktop/my-portfolio/technical_requirements_document.md)

This document provides a highly detailed schema specification for MongoDB (via Mongoose ODM) and API access control rules.

---

## 1. Database Model & Collection Specifications

All collection schemas contain standard auditing keys `createdAt (ISODate)` and `updatedAt (ISODate)` populated automatically via Mongoose schema timestamps configuration.

### 1.1 Collection: `admins`
Holds credentials for the administrator. Only one document should exist under normal operations.
- **`_id`:** `ObjectId` (Primary Key)
- **`email`:** `String` (Required, unique, lowercase, trimmed, regex matching email standards)
- **`passwordHash`:** `String` (Required, bcrypt hash with 12 rounds)

```javascript
// Mongoose Schema Definition
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  passwordHash: {
    type: String,
    required: true
  }
}, { timestamps: true });
```

### 1.2 Collection: `profiles`
Holds general developer information shown in the left column.
- **`_id`:** `ObjectId` (Primary Key)
- **`name`:** `String` (Required, default: "Virendra Kumar")
- **`title`:** `String` (Required, default: "Full Stack Developer")
- **`tagline`:** `String` (Required, max 300 characters)
- **`about`:** `String` (Required, max 5000 characters, Markdown/Text)
- **`statusBadge`:** `Object`
  - **`text`:** `String` (Default: "Open to Work")
  - **`visible`:** `Boolean` (Default: true)

### 1.3 Collection: `projects`
Holds project entries displayed in the portfolio list.
- **`_id`:** `ObjectId` (Primary Key)
- **`title`:** `String` (Required, max 100 characters)
- **`description`:** `String` (Required, max 1000 characters)
- **`highlights`:** `Array of Strings` (Max 300 characters per string, bullet lists)
- **`techStack`:** `Array of Strings` (Trimmed stack technologies, e.g. ["React", "Express"])
- **`githubUrl`:** `String` (Valid URL format)
- **`demoUrl`:** `String` (Valid URL format)
- **`thumbnail`:** `String` (Filename of the uploaded image inside `server/uploads/`)
- **`displayOrder`:** `Number` (Required, default: 0, sorting index)
- **`featured`:** `Boolean` (Default: false)
- **`isMLProject`:** `Boolean` (Default: false)

### 1.4 Collection: `skills`
Holds categorized skill chips.
- **`_id`:** `ObjectId` (Primary Key)
- **`category`:** `String` (Required, e.g. "Frontend", "Backend")
- **`skills`:** `Array of Strings` (Required, list of skills inside the category)
- **`displayOrder`:** `Number` (Default: 0)
- **`isAdditional`:** `Boolean` (Default: false, true maps to dashed ML/secondary grid styles)

### 1.5 Collection: `experiences`
Holds career timeline checkpoints.
- **`_id`:** `ObjectId` (Primary Key)
- **`title`:** `String` (Required, e.g. "MERN Intern")
- **`company`:** `String` (Required, e.g. "Skill Risers")
- **`companyUrl`:** `String` (Valid URL)
- **`duration`:** `String` (Required, e.g. "3 Months")
- **`description`:** `Array of Strings` (Required, bullet details)
- **`techStack`:** `Array of Strings` (Technologies used)
- **`displayOrder`:** `Number` (Default: 0)

### 1.6 Collection: `educations`
Holds academic milestones.
- **`_id`:** `ObjectId` (Primary Key)
- **`period`:** `String` (Required, e.g. "2022 — 2026")
- **`degree`:** `String` (Required)
- **`institution`:** `String` (Required)
- **`location`:** `String` (City/State)
- **`score`:** `String` (Percentage or CGPA, e.g. "71%")
- **`displayOrder`:** `Number` (Default: 0)

### 1.7 Collection: `certifications`
- **`_id`:** `ObjectId` (Primary Key)
- **`name`:** `String` (Required)
- **`provider`:** `String` (Required, e.g. "Udemy")
- **`url`:** `String` (Valid URL)

### 1.8 Collection: `socials`
Holds contact URLs.
- **`_id`:** `ObjectId` (Primary Key)
- **`github`:** `String` (Valid URL)
- **`linkedin`:** `String` (Valid URL)
- **`leetcode`:** `String` (Valid URL)
- **`email`:** `String` (Valid Email)
- **`custom`:** `Array of Objects`
  - **`label`:** `String` (Max 50 chars)
  - **`url`:** `String` (Valid URL)

---

## 2. Database Indexes
To maintain optimal lookup times during portfolio loading:

1. **`admins.email` (Unique):** Unique index ensures no duplicate accounts.
2. **`projects.displayOrder` (Ascending):** Accelerates primary catalog query.
3. **`projects.isMLProject` + `projects.displayOrder` (Compound):** Optimizes separated tabs queries.
4. **`skills.displayOrder` (Ascending):** Sorts skills categories.
5. **`experiences.displayOrder` (Ascending):** Sorts work items chronology.

---

## 3. Session & Authentication Handling

Authentication uses a **Stateless JWT Architecture**:
- **Authentication Method:** Payload-signed JSON Web Tokens (`HS256` symmetric signing).
- **Session Duration:** `24 hours` before mandatory re-login.
- **Signing payload structure:**
```json
{
  "id": "mongo_object_id_of_admin",
  "email": "admin@email.com",
  "iat": 1780664162,
  "exp": 1780750562
}
```

### Authentication Protection Middleware Logic
```javascript
const jwt = require('jsonwebtoken');

module.exports = function protectRoute(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }
};
```

---

## 4. Permissions & Route Access Matrix

Since this is a single-developer CMS portfolio, the system uses two basic access scopes: **Public (anonymous reader)** and **Admin (authorized manager)**.

| HTTP Method | Route Endpoint | Required Role | Description |
|---|---|---|---|
| **POST** | `/api/auth/login` | Public | Initiates session |
| **GET** | `/api/auth/verify` | Public | Validates active session token |
| **GET** | `/api/profile` | Public | Reads layout info |
| **PUT** | `/api/profile` | Admin | Updates layout info |
| **GET** | `/api/projects` | Public | Lists projects |
| **POST** | `/api/projects` | Admin | Adds new project |
| **PUT/DELETE**| `/api/projects/:id` | Admin | Manages target project item |
| **GET** | `/api/skills` | Public | Lists categories |
| **POST/PUT/DELETE**| `/api/skills` | Admin | Manages skills |
| **GET** | `/api/experience` | Public | Lists career history |
| **POST/PUT/DELETE**| `/api/experience` | Admin | Manages career items |
| **GET** | `/api/education` | Public | Lists academic history |
| **POST/PUT/DELETE**| `/api/education` | Admin | Manages school items |
| **GET** | `/api/resume/download`| Public | Downloads current resume PDF |
| **POST** | `/api/resume/upload` | Admin | Replaces current resume PDF |

---

## 5. Security & Data Ownership

- **Single-Tenant Isolation:** The backend explicitly guards data updates. Writing operations check that requests contain a valid admin ID matching the seeded admin database record.
- **CSRF / CORS Mitigation:** The API rejects incoming requests from domains outside the configuration's `ALLOWED_ORIGIN` variables in production environments.
- **Payload Size Limits:** `multer` intercepts file uploads. The server rejects files exceeding `5MB` for PDF resumes and `2MB` for PNG/JPEG project thumbnails.
- **Data Validation:** Mongoose schemas enforce data structures natively. Database triggers or middlewares clean HTML tags from metadata to prevent Cross-Site Scripting (XSS).
