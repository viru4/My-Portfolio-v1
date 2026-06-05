# UX Flow & Interaction Document — MERN Portfolio + CMS

**Authored by:** Senior UX Strategist & System Architect  
**Companion to:** [Implementation Plan](file:///c:/Users/Lenovo/OneDrive/Desktop/my-portfolio/implementation_plan.md) and [Technical Requirements Document](file:///c:/Users/Lenovo/OneDrive/Desktop/my-portfolio/technical_requirements_document.md)

---

## 1. Global Visual Theme & Interaction Systems

To achieve a cohesive, high-end feel, the entire application relies on a consistent Glassmorphism theme and interactive system.

### 1.1 Glassmorphism Specifications (CSS Properties)
- **Base Cards:** `rgba(17, 17, 39, 0.45)` backdrop fill with `16px` blur, bordered with `1px solid rgba(167, 139, 250, 0.12)`.
- **Card Hover:** Background deepens to `rgba(17, 17, 39, 0.60)`, borders brighten to `rgba(167, 139, 250, 0.30)`, card shifts `-2px` vertically.
- **Background Depth:** Solid base background (`#0a0a1a`) overlayed with a dynamic radial cursor-spotlight glow (`rgba(139, 92, 246, 0.12)` size `500px`) following user pointer.

### 1.2 Global Feedback Indicators
- **Toast Manager:** A container in the top-right corner of the window. Translucent glass containers (`backdrop-filter: blur(12px)`) that slide in from the right (`+300px` to `0px` offset) and automatically fade out/slide back after `3000ms`.
  - **Success Toast:** Green glow border (`#4ade80`), success check icon, bold header, description text.
  - **Error Toast:** Red glow border (`#f87171`), error warning icon, bold header, description text.
- **API Loading State:** Skeleton loaders styled as gray glass gradient pulses (`@keyframes pulse`) matching the exact physical layout of the elements they are loading.
- **Active Navigation Dots:** Vertical list of navigation items. Active section item glows (`text-shadow`) and is preceded by a solid filled dot (`#a78bfa`), while inactive items use an empty circle (`#6b6b80`) with lower opacity.

---

## 2. Public Portfolio App Flow (`/`)

The public site is a responsive single-page application consisting of a two-column desktop layout (which collapses to a single-column layout on viewport widths `< 1024px`).

```
+-----------------------------------------------------------------------+
|                                  [Progress Bar]                       |
+------------------------------------+----------------------------------+
|                                    |                                  |
|   LEFT SIDEBAR (Sticky)            |   RIGHT VIEWPORT (Scrollable)    |
|                                    |                                  |
|   [Status Badge] Open to Work      |   [About Section]                |
|                                    |   Tagline + Bio paragraphs       |
|   VIRENDRA KUMAR                   |                                  |
|   Full Stack Developer             |   [Experience Section]           |
|                                    |   Frosted timeline cards         |
|   [Navigation Dots]                |                                  |
|   * About                          |   [Projects Section]             |
|   o Experience                     |   Featured project list          |
|   o Projects                       |   ML projects tagged "ML"        |
|   o Skills                         |                                  |
|   o Contact                        |   [Skills Section]               |
|                                    |   Grouped grids + ML dashboard   |
|   [Social Links]                   |                                  |
|   [GitHub] [LinkedIn] [Email]      |   [Education & Certs]            |
|                                    |                                  |
|                                    |   [Contact Form / Say Hello]     |
|                                    |                                  |
+------------------------------------+----------------------------------+
```

### 2.1 Navigation & Scroll Behavior
- **Scroll Progress Tracker:** A thin bar running fixed along the top edge of the window. Width dynamically changes from `0%` to `100%` based on standard `window.scrollY` / `document.documentElement.scrollHeight` ratio. Filled with purple-indigo gradient.
- **Smooth Anchor Scroll:** Clicking any navigation dot or text item smoothly scrolls the viewport to the targeted element using `{ behavior: 'smooth' }`.
- **Intersection Observer:** An observer monitors viewport segments. When `70%` of a section enters the viewport, its corresponding dot in the left sidebar activates immediately, and the URL hash updates silently without jumping.

### 2.2 Screen Elements & Component Micro-Flows

#### 2.2.1 Hero / Status Badge
- **User Action:** Hover over "Open to work" badge.
- **Behavior:** Pulsing green glow dot scales up from `1.0` to `1.2`.
- **Empty State:** If profile status in API returns `visible: false`, the badge fades out completely.

#### 2.2.2 Experience Section
- **Dynamic State:** Loads list from `/api/experience` sorted by `displayOrder`.
- **Empty State:** If zero items exist, display a clean placeholder text: *"Check back soon for career updates."*
- **Click Behavior:** Hovering over a card brightens the card border. Clicking the title or company logo link opens the company's URL in a new tab if populated.

#### 2.2.3 Projects Section
- **Dynamic State:** Displays projects sorted by `displayOrder`. Regular projects render with standard borders. Machine learning projects (flagged `isMLProject: true`) are placed in their own tab/sub-grid with a dashed border pill labeled "Additional Skill: Machine Learning".
- **Hover Spotlight:** Hovering over a project card moves a radial gradient spotlight across the card background (`mousemove` handler inside the card bounds).
- **Empty State:** Displays *"No projects found."*

#### 2.2.4 Skills Section
- **Grid Layout:** Groups skills by category. Core skills (Frontend, Backend, Databases) appear in primary cards. Secondary categories (like Machine Learning) appear with dashed borders and semi-transparent badges.
- **Empty State:** Container is skipped or hidden if category contains no skills.

#### 2.2.5 Contact CTA Button
- **Click Behavior:** Triggers standard `mailto:` link with pre-populated email address pulled from `/api/social`. If email is unavailable, triggers copy-to-clipboard action and displays Success Toast: *"Email copied to clipboard!"*

---

## 3. Admin Authentication Flow (`/admin/login`)

```
+--------------------------------------------------+
|                    [ ADMIN LOGIN ]               |
|                                                  |
|  Email:    [ admin@domain.com                  ] |
|  Password: [ **********                        ] |
|                                                  |
|            [        Login ->        ]            |
+--------------------------------------------------+
```

- **Authentication Guard:** If the user requests `/admin` without a valid JWT token in `localStorage`, the router intercepts the call, renders the modal login view, and blocks the administration screen.
- **Submit Action (Login Button Click):**
  1. Sets button status to `loading` (disables button, changes text to a spinner, lowers opacity to `0.7`).
  2. Sends `POST` request to `/api/auth/login`.
  - **Success State:**
    1. Returns a JWT token.
    2. Client saves token to `localStorage.setItem('adminToken', token)`.
    3. Triggers Success Toast: *"Authenticated successfully. Welcome back!"*
    4. Renders the main Admin Dashboard page.
  - **Error State (Invalid credentials or network failure):**
    1. Triggers Error Toast: *"Invalid email or password."* or *"Network timeout."*
    2. Clears password field, focuses input, and returns button to active state.
    3. Adds a red outline (`border: 1px solid #f87171`) to input fields. Highlights shake briefly.

---

## 4. Admin Dashboard Workspace (`/admin`)

The Admin workspace uses a sidebar navigation interface layout. Clicking on a sidebar option switches the active workspace view in the center pane.

```
+-------------------+---------------------------------------------------+
|  [Admin Profile]  |  [Active Pane: CRUD Workspace]                    |
|                   |                                                   |
|  * Profile        |  Header: Projects List                            |
|  o Projects       |                                                   |
|  o Skills         |  +---------------------------------------------+  |
|  o Experience     |  | [Thumbnail] CraftCurio  (Featured)  [Edit]   |  |
|  o Education      |  | MongoDB, Express, React, Node.js     [Delete] |  |
|  o Certificates   |  +---------------------------------------------+  |
|  o Resume         |                                                   |
|  o Socials        |  [ + Add New Project ]                            |
|                   |                                                   |
|  [ Logout Button ]|                                                   |
+-------------------+---------------------------------------------------+
```

### 4.1 Global CRUD Form Lifecycle & Behaviors
Every edit or creation form across the sections adheres to these behaviors:
1. **Modal Form Open:** Renders overlay behind dialog card. Transitions opacity `0` to `1` over `200ms`. Autofocuses the first text input.
2. **Form Submission:**
   - Client validates fields (URLs match regex, numbers are positive integers).
   - If client validation fails, block submission, highlight invalid field in red, and display inline error label.
   - If validation passes, send `POST` (create) or `PUT` (update) request. Set submit button state to `loading`.
   - On **Success:** Close modal, clear form values, refresh the dashboard content pane, and display Success Toast: *"Item saved successfully!"*.
   - On **Error:** Keep modal open, print API error message in warning card, and return submit button to active state.
3. **Delete Confirmation Dialog:**
   - Clicking a delete button opens a nested warning modal.
   - Modal prompt: *"Are you sure you want to delete [Item Title]? This action cannot be undone."*
   - Red button: **Yes, Delete**; Gray button: **Cancel**.
   - If confirmed, send `DELETE` request. Display Success Toast: *"Item deleted successfully."*

### 4.2 Workspace Section Behaviors

#### 4.2.1 Profile Section
- **Manage Fields:** Name, Title, Tagline, About (multi-line textarea), Status Badge toggles.
- **Actions:** Click **Save Changes** to dispatch API call.
- **Live Preview Integration:** Click **Live Preview** to open the public site `/` in a new tab.

#### 4.2.2 Projects Management Pane
- **Fields:** Title, Description, Tech Stack Tags (type a tag and press `Enter` to append, click `x` on a tag to remove), GitHub URL, Demo URL, Display Order index, Thumbnail File Select, Featured checkbox, ML Project checkbox.
- **Empty State:** If no projects are found, show: *"No projects added. Click '+ Add New Project' to populate."*

#### 4.2.3 Skills Management Pane
- **Fields:** Category Title, Skills tag list, Order weight index, Is Additional/ML checkbox.
- **Empty State:** *"No skill categories defined."*

#### 4.2.4 Experience Management Pane
- **Fields:** Position Title, Company Name, Duration, Description Bullet Points (dynamically add/remove bullet rows), Tech tags, Display Order index.
- **Empty State:** *"No work experiences listed."*

#### 4.2.5 Education Management Pane
- **Fields:** Degree Title, School/College name, Location, Completion Period, Score (GPA/Percentage), Display Order.
- **Empty State:** *"No education entries recorded."*

#### 4.2.6 Certifications Management Pane
- **Fields:** Title, Provider, Link.
- **Empty State:** *"No certifications listed."*

#### 4.2.7 Resume Management Pane
- **Upload Flow:** Choose File (enforces PDF extension, files < 5MB). Drag-and-drop zone.
  - **Drop Active State:** Border turns purple and dashed, backdrop shifts color.
  - **Success:** Returns uploaded resume filename. Displays toast.
- **Enforced Rules:** If resume is missing, the frontend portfolio disables the "View Resume" button or renders it grayed out.

#### 4.2.8 Socials Management Pane
- **Fields:** Input text lines for GitHub URL, LinkedIn URL, Leetcode URL, Email address.
- **Save Trigger:** Saves inline immediately when the user clicks the "Update Links" button.

---

## 5. Security & Logout States

- **Automatic Session Expiry:** The admin shell checks the JWT expiration payload client-side on route transitions. If expired, clears token and triggers login page.
- **Logout Sequence:**
  1. Click the "Logout" button.
  2. Prompt: *"Log out of admin dashboard?"*
  3. Action: Clears `adminToken` key from `localStorage`.
  4. Redirection: Instantly shifts route back to `/` portfolio view.
  5. Notification: Success Toast: *"Logged out successfully. Secure session ended."*
- **Unauthorized API responses:** If a dashboard fetch receives `401 Unauthorized` (indicating JWT is revoked, modified, or expired), the dashboard clears storage keys and forces the login prompt immediately.
