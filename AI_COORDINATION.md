# 🐺 AI COORDINATION PROTOCOL: BUILD YOUR WOLFPACK

**Status:** ACTIVE
**Last Updated:** Jan 12, 2026
**Current Focus:** CRITICAL BUG FIX - Kanban Initialization & UI/UX Optimization

## 🚨 CRITICAL RULES
1.  **Branch-First Protocol:** NEVER push directly to `main`. Always use feature branches (e.g., `fix/kanban-init`, `feat/social-nudge`).
2.  **Tactical Noir Aesthetic:** All UI must adhere to the "War Room" style. Dark mode (#111), Gold accents (#FFD700), Monospace fonts for data.
3.  **Game Loop Integrity:** The 40-task Kanban is the core engine. It MUST load correctly upon initialization.
4.  **Monetization First:** Coffee Shop Homebase is mandatory. Marketing fees are the business model.

## 🛠 CURRENT MISSION: UI/UX OVERHAUL & KANBAN RESCUE
**Objective:** Implement "Progressive Disclosure" for the 40 tasks and "Structured Networking" for introverts.

### 🎨 UI/UX Principles (Research-Backe17	1.  **Holistic Visibility:** Show ALL 40 tasks by default. Users need to see the full battlefield to strategize and delegate.
18	    *   **"ALL OPS" Tab:** Default view showing every task.
19	    *   **Phase Filters:** Optional filters for focus, not locks.
2.  **Structured Networking:** Use "Protocols" (e.g., Coffee Protocol) instead of open chat. Reduce social friction.
3.  **Gamified Feedback:** Every drag-and-drop must have a "Juicy" feel (sound, haptics, visual flash).

### Active Agents & Tasks
*   **Agent Manus (Current):** PUSHING TO GITHUB & HANDING OFF.
*   **Completed Features:**
    *   **Holistic Visibility:** "ALL OPS" tab implemented.
    *   **Drag-to-Assign:** Sidebar avatars can be dropped on tasks.
    *   **Multi-Avatar Stacking:** Tasks support multiple assignees.
    *   **Role Badges:** Avatars display role icons (Hammer, Calculator, etc.).
*   **Next Steps:**
    *   **Backend Integration:** Connect `ProjectContext` to real API endpoints.
    *   **Real-Time Sync:** Implement WebSockets.
    *   **Sound Design:** Add mechanical click sounds.

### 🚀 Deployment Strategy (Shopify Integration)
**Current Host:** Shopify (Liquid Theme)
**App Type:** React SPA (Vite)
**Conflict:** Shopify Themes cannot natively host a React SPA without modification.

**Recommended Strategy (Option A - Subdomain):**
1.  Deploy this React app to Vercel/Netlify (e.g., `app.buildyourwolfpack.com`).
2.  Link to it from the Shopify main menu.

**Alternative Strategy (Option B - Embedded):**
1.  Build the app: `pnpm build`.
2.  Upload `dist/assets` to Shopify `assets/` folder.
3.  Create a `page.wolfpack.liquid` template that loads the React bundle.

### 📂 Key Files
*   `src/pages/MintID.tsx`: Entry point. Generates initial user state.
*   `src/contexts/ProjectContext.tsx`: Manages task state.
*   `src/components/KanbanBoard.tsx`: Visualizes the tasks.

## 📝 CHANGELOG
*   **v3.6 (Pending):** Fix Kanban 40-task bug.
*   **v3.5:** Added Snarky Dom, Coffee Shop Enforcement, Celebration Effects.
