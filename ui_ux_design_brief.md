# UI/UX Design Brief — MERN Portfolio & CMS

**Authored by:** Senior UI/UX Designer  
**Companion to:** [UX Flow & Interaction Document](file:///c:/Users/Lenovo/OneDrive/Desktop/my-portfolio/ux_flow_document.md)

---

## 1. Core Visual Style: Neon-Accented Glassmorphism
The visual system is designed to look premium, modern, and highly interactive. It uses a **deep dark mode** backdrop layered with **frosted glass cards** and sharp **neon gradient borders** that respond dynamically to pointer location.

### 1.1 The Glassmorphism Rulebook
To maintain a high-quality glass effect, every card component must follow these styling rules:
- **Translucency:** Background must use low-opacity colors (`rgba`) combined with backdrop-blur. Never use solid colors.
- **Specularity (Top Light):** Add a subtle inner top border highlight representing reflected light.
- **Glow Borders:** Card borders should use very low opacity values that scale up dynamically on hover.

```css
/* Design System CSS Base Tokens */
:root {
    /* Backgrounds */
    --color-bg-deep: #0a0a1a;          /* Deep space main background */
    --color-bg-surface: #111127;       /* Lifted surface background */
    
    /* Glass Colors */
    --glass-bg: rgba(17, 17, 39, 0.45);
    --glass-bg-hover: rgba(17, 17, 39, 0.60);
    --glass-border: rgba(167, 139, 250, 0.12);
    --glass-border-hover: rgba(167, 139, 250, 0.35);
    --glass-inner-light: rgba(255, 255, 255, 0.05);

    /* Neon Accents */
    --color-accent-violet: #a78bfa;    /* Neon Violet (violet-400) */
    --color-accent-indigo: #818cf8;    /* Indigo Glow (indigo-400) */
    --color-accent-cyan: #22d3ee;      /* Cyber Cyan (cyan-400) */
    
    /* Neon Gradients */
    --gradient-primary: linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-indigo));
    --gradient-glow: linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-cyan), var(--color-accent-indigo));
    
    /* Typography Colors */
    --text-primary: #a1a1b5;           /* Lavender-gray body text */
    --text-heading: #ededf0;           /* Near-white headings */
    --text-muted: #6b6b80;             /* Muted grey metadata */
}
```

---

## 2. Typography & Hierarchy
All text elements must map directly to the following system to prevent cluttered hierarchy:

- **Headings Font:** **Outfit** (Google Fonts). Sleek, geometric, modern.
- **Body Font:** **Inter** (Google Fonts). Neutral, highly legible.

| Element | Font | Weight | CSS Size | Letter Spacing | Styling / Color |
|---|---|---|---|---|---|
| Portfolio Brand Name (`h1`) | Outfit | 800 (Extra Bold) | `4.0rem` | `-0.02em` | Gradient Fill (`--gradient-primary`) |
| Section Headings (`h2`) | Outfit | 600 (Semi-Bold) | `1.75rem` | `-0.01em` | Near-White (`--text-heading`) |
| Card / List Titles (`h3`) | Outfit | 600 (Semi-Bold) | `1.2rem` | `0` | Violet hover shift |
| General Body Text | Inter | 400 (Regular) | `1.0rem` | `0` | Lavender-gray (`--text-primary`), `line-height: 1.75` |
| Navigation Links | Inter | 600 (Semi-Bold) | `0.8rem` | `0.12em` | Uppercase, Active state indicator |
| Tech Pills / Badges | Inter | 500 (Medium) | `0.75rem` | `0.05em` | Muted background with solid borders |

---

## 3. Page Layout Structures

### 3.1 Public Page: Two-Column Split Screen (`/`)
- **Left Column (40% width, Sticky):**
  - Stays fixed inside the viewport.
  - Contains: Status badge, big typography name, role descriptor text, vertical navigation dots, and horizontal list of social icons at the bottom.
- **Right Column (60% width, Scrollable):**
  - Houses the actual sections: About, Experience, Projects, Skills, Education, and Contact.
  - Generous vertical padding (`120px` spacing between sections) prevents text overcrowding.

### 3.2 Admin Layout: Split Workspace Panel (`/admin`)
- **Left Sidebar Navigation (250px wide, Glass):**
  - Frosted glass sidebar panel containing the active administration page tabs (Profile, Projects, Skills, etc.) and a red "Logout" option at the bottom.
- **Main Editor Canvas (Remaining width, Scrollable):**
  - Padded canvas holding forms, dynamic data grid listings, and controls inside large glass container cards.

---

## 4. UI Component Definitions

### 4.1 Frosted Glass Cards (`.glass-card`)
- **Default Visuals:**
  - `backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);`
  - `border: 1px solid var(--glass-border);`
  - `box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 var(--glass-inner-light);`
  - `border-radius: 16px;`
- **Interactive Hover Action:**
  - Card scales up smoothly (`transform: translateY(-3px) scale(1.01)`).
  - Border transitions to `var(--glass-border-hover)`.
  - Subtle drop-shadow glow: `box-shadow: 0 12px 40px 0 rgba(139, 92, 246, 0.15)`.

### 4.2 Interactive Shimmer Buttons
- **Style:** Capsule shape, gradient background, white text.
- **Hover Sweep Shimmer:** Hovering over a button triggers a diagonal glossy stripe animation (`linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`) sweeping left-to-right across the button over `600ms`.

### 4.3 Form Input Fields
- **Default State:** Dark transparent fill (`rgba(10, 10, 26, 0.5)`), thin borders (`1px solid var(--glass-border)`), rounded corners (`8px`).
- **Focus State:** Border turns indigo, background dims slightly, input field gains a soft blue glow (`box-shadow: 0 0 10px rgba(99, 102, 241, 0.2)`).

---

## 5. Mobile Responsiveness Design Rules

- **Responsive Breakdown Thresholds:**
  - Mobile: `< 768px`
  - Tablet: `768px` to `1024px`
  - Desktop: `> 1024px`
- **Mobile Split Column Collapse:** On screens `< 1024px`, the two-column public split layout snaps to a single-column layout. The Left Sidebar elements (Hero information, social links) stack at the top of the viewport, and the scrollable content shifts directly underneath.
- **Mobile Navigation Bar:** Navigation dots disappear on mobile viewports. They are replaced by a sticky frosted-glass top header navigation bar (`backdrop-filter: blur(12px)`) displaying a compact menu toggle.
- **Touch Zones:** All interactive buttons, chips, and input elements on mobile must have a minimum clickable height of `48px`.

---

## 6. Motion & Feedback Guidelines

- **Transitions:** All UI animations (hover transitions, opacity fades, position adjustments) must use a standard ease cubic-bezier: `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`.
- **Skeleton State Pulse:** Skeleton loaders must pulse from `rgba(255,255,255,0.03)` to `rgba(255,255,255,0.08)` over a `1.5s` looping period.
- **Pointer spotlights:** Mouse position triggers a CSS dynamic update variables (`--mx`, `--my`) to project a spotlight glow onto card overlays.
