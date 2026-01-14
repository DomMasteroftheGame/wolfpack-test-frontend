# 🐺 UI/UX Developer Mission Brief: "Tactical Noir" Overhaul

**Objective:** Transform the "Build Your Wolfpack" interface into a high-stakes, gamified "War Room" that feels like an "Easy Button" for startup founders.

**Aesthetic:** "Tactical Noir"
*   **Base:** Deep Charcoal / Void Black (#111)
*   **Accent:** Cyber Gold (#FFD700) & Neon Blue (for Intel)
*   **Vibe:** Think *Cyberpunk 2077* meets *Bloomberg Terminal*. Serious, data-dense, but incredibly satisfying to use.

## 🎯 Core Mission 1: The "Juicy" Kanban
The current Kanban is functional but dry. It needs to feel like a game.
*   **Interaction:** Every drag-and-drop must have haptic feedback (if mobile) and a satisfying "mechanical click" sound.
*   **The Feast (Done Column):** Dropping a card here should trigger a subtle gold particle effect or a "Cash Register" sound.
*   **Phase Tabs:** The new Phase Tabs are solid gold. Ensure the transition between phases is a smooth "slide" animation, not a jarring jump.

## 🎯 Core Mission 2: Introvert-Friendly Networking
Our users hate "networking". Make it feel like "signaling".
*   **The Signal Button:** Currently a simple button. Make it a **Hold-to-Send** interaction (like charging a weapon).
    *   *Visual:* Button fills up with gold light.
    *   *Release:* Sends a "Sonar Ping" animation outward from the user's avatar.
*   **Radar View:** The "Wolf Search" radar should constantly scan (rotating line). When a match is found, it should "lock on" with a target reticle.

## 🎯 Core Mission 3: The "Easy Button" Onboarding
New users are overwhelmed. Guide them without holding their hand.
*   **Ghost Overlay:** The current tour is good. Enhance it with "Spotlight" effects that dim the rest of the screen completely.
*   **Dom's Voice:** The "Snarky Coach" bubble needs to be more animated. When Dom speaks, the bubble should expand/contract slightly.

## 🛠 Technical Constraints
*   **Stack:** React 19 + Tailwind 4.
*   **Performance:** No heavy 3D libraries. Use CSS animations and SVGs for effects.
*   **Mobile First:** All touch targets must be at least 44px. The "Tactical Belt" (bottom nav) is the primary navigation on mobile.

**Deliverable:** A polished, high-fidelity UI update that makes the user feel like a tactical genius, not a project manager.
