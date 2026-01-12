# 🐺 AI COORDINATION PROTOCOL: BUILD YOUR WOLFPACK

**Status:** ACTIVE
**Last Updated:** Jan 12, 2026
**Current Focus:** CRITICAL BUG FIX - Kanban Initialization & UI/UX Optimization

## 🚨 CRITICAL RULES
1.  **Branch-First Protocol:** NEVER push directly to `main`. Always use feature branches (e.g., `fix/kanban-init`, `feat/social-nudge`).
2.  **Tactical Noir Aesthetic:** All UI must adhere to the "War Room" style. Dark mode (#111), Gold accents (#FFD700), Monospace fonts for data.
3.  **Game Loop Integrity:** The 40-task Kanban is the core engine. It MUST load correctly upon initialization.
4.  **Monetization First:** Coffee Shop Homebase is mandatory. Marketing fees are the business model.

## 🛠 CURRENT MISSION: FIX KANBAN & OPTIMIZE UX
**Objective:** Ensure the 40 preloaded tasks appear immediately after "Mint ID" and improve the board's usability.

### Active Agents & Tasks
*   **Agent Manus (Current):** Debugging `ProjectContext.tsx` and `MintID.tsx`. Fixing task generation logic.
*   **Next Steps:**
    *   Verify `localStorage` vs API data flow.
    *   Implement "Task Groups" or "Phases" to declutter the 40 tasks.
    *   Enhance "Dom Bubble" to react to specific task blockers.

### 📂 Key Files
*   `src/pages/MintID.tsx`: Entry point. Generates initial user state.
*   `src/contexts/ProjectContext.tsx`: Manages task state.
*   `src/components/KanbanBoard.tsx`: Visualizes the tasks.

## 📝 CHANGELOG
*   **v3.6 (Pending):** Fix Kanban 40-task bug.
*   **v3.5:** Added Snarky Dom, Coffee Shop Enforcement, Celebration Effects.
