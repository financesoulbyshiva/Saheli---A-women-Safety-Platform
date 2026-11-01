# SAHELI — Smart Women Safety & Emergency Assistance Platform

> **Core Message:** *"Safety before the emergency."*
> **Architecture:** Clean Full-Stack Monorepo Structure

---

## Monorepo Architecture

```
SAHELI/
├── frontend/    # [IMPLEMENTED] React 18 + Vite SPA, UI & State Engine
├── backend/     # [FUTURE / NOT IMPLEMENTED] Node.js/Express API Service Placeholder
├── database/    # [FUTURE / NOT IMPLEMENTED] Relational / Document Persistence Placeholder
└── docs/        # Complete Product, UI, and Technical Documentation
```

### Current Implementation Status
- **Frontend:** `IMPLEMENTED` (Interactive Presentation Prototype)
- **Backend:** `FUTURE / NOT IMPLEMENTED` (Placeholder Service)
- **Database:** `FUTURE / NOT IMPLEMENTED` (Placeholder Schemas)

### System Flow
$$\text{Frontend} \longrightarrow \text{Future API} \longrightarrow \text{Future Backend} \longrightarrow \text{Future Database}$$

> **Important Prototype Notice:** The current project is a frontend prototype using mock data and simulated safety actions. It operates 100% client-side without external backend or database dependencies.

---

## Problem

Traditional personal safety solutions are almost entirely reactive. They assume that assistance begins only after violence, harassment, or physical danger is already underway—requiring a woman in active distress to unlock her phone, locate an app, and trigger an emergency siren. In real-world situations, early warning signs occur minutes before danger escalates. Without proactive early-assistance mechanisms, users are left with an all-or-nothing choice between complete silence and calling emergency services.

---

## Solution

SAHELI introduces a **proactive continuum of care** that guides women through 4 structured phases before, during, and after an incident:

$$\text{PREVENT} \longrightarrow \text{ASSIST} \longrightarrow \text{ESCALATE} \longrightarrow \text{RECOVER}$$

1. **PREVENT (SafeWalk):** Continuous companion journey monitoring, automated check-in timers, and scheduled arrival tracking during routine travel.
2. **ASSIST (Caution Mode):** Early discomfort tools—discrete simulated guardian pings, incoming fake call simulator, and verified 24/7 safe havens—activated with a single tap.
3. **ESCALATE (Threat & Emergency):** High-urgency posture prioritizing immediate shelter navigation, emergency broadcast preparation, and high-visibility SOS triggers.
4. **RECOVER (Reassurance):** Resolves emergency state, broadcasts reassuring "I'm Safe" updates to trusted contacts, and maintains an auditable timeline ledger.

---

## Core Features

- **SafeWalk Companion:** Proactive journey companion featuring customizable origin/destination, ETA monitoring, route waypoints, and interactive safety check-in countdown.
- **Safety Status:** Central state machine driving reactive ambient theming, status indicator pills, and clear visual postures.
- **Progressive Safety Escalation:** Structured transition paths from calm travel to cautionary awareness, threat defense, and emergency recovery.
- **Guardian Network:** Trusted circle of contacts highlighting a Primary Guardian (*Mother*) and Secondary Standby Guardians with mock availability, battery levels, and local contact addition.
- **Safe Places:** Curated list of verified safe havens (Apollo 24/7 Pharmacy, Pink Police Booth, Campus Security, Metro Station) with facility features, walking distances, and simulated arrival check-ins.
- **Emergency Mode:** High-urgency crisis mode with pulsing red visual alerts, simulated standby broadcast preparation, nearest haven directions, and prominent resolution controls.
- **Incident Timeline:** Comprehensive chronological ledger logging every state shift, safety check-in, guardian alert, and resolution with demo timestamps.
- **Safety Simulator:** Interactive presentation engine featuring 5 pre-configured realistic safety scenarios (including the recommended *Being Followed* escalation demo) with step-by-step presenter controls.

---

## Safety State Machine

The interface dynamically transforms across 5 standardized safety states:

$$\mathbf{SAFE} \longrightarrow \mathbf{CAUTION} \longrightarrow \mathbf{THREAT} \longrightarrow \mathbf{EMERGENCY} \longrightarrow \mathbf{RECOVERED} \longrightarrow \mathbf{SAFE}$$

| State | Theme Color | Purpose & System Posture |
|---|---|---|
| **`SAFE`** | 🟢 Green | Routine companion monitoring. SafeWalk active with check-in countdown. |
| **`CAUTION`** | 🟡 Amber | Early discomfort. Discreet guardian alert and directions to nearby safe havens. |
| **`THREAT`** | 🟠 Orange | Heightened risk. Emergency actions armed and immediate shelter prioritized. |
| **`EMERGENCY`** | 🔴 Red | High crisis. Full-screen emergency assistance with simulated broadcasts. |
| **`RECOVERED`** | 🟢 Calm Green | Reassurance. Guardians notified of safety, debrief logged, returning to baseline. |

---

## Technology

SAHELI is built as a lightweight, accessible, frontend-only Single Page Application (SPA):

- **Framework:** React 18 + Vite
- **Styling:** Vanilla Modern CSS with semantic Design Tokens (`design-tokens.css`, `global.css`, `components.css`)
- **Iconography:** Lucide React icons
- **Audio Synthesis:** Web Audio API (in-browser synthesized chime and alerts; zero external MP3 assets)
- **State Management:** React Context API (`SafetyContext`) providing a single source of truth
- **Mock Data Engine:** Local JSON structures simulating routes, contacts, safe havens, and scenario steps

---

## Important Prototype Limitation

> **⚠️ ACADEMIC DEMONSTRATION NOTICE:**
> "This project is a frontend prototype using mock data and simulated emergency actions. It does not make real calls, send real messages, share live location, contact emergency services, or provide live tracking."
>
> All notifications, phone calls, dispatch logs, and GPS distances are client-side simulated demonstrations intended for academic presentation and UX evaluation.

---

## Demo Flow

For college evaluations and live faculty demonstrations:

1. **Dashboard:** Review baseline `SAFE` status, mock battery of Primary Guardian (*Mother*), and nearest haven (*Apollo 24/7 Pharmacy*).
2. **Start SafeWalk:** Launch companion walk from College Campus to Home (ETA 7:30 PM).
3. **"I'm Uncomfortable":** Tap button on Dashboard or SafeWalk to trigger `CAUTION` mode.
4. **Assist Tools:** Explore verified safe haven directions and simulated guardian standby alert.
5. **Escalate to THREAT:** Escalate to `THREAT` mode as situation intensifies.
6. **Activate Emergency:** Tap `SOS Emergency` to enter high-urgency `EMERGENCY` mode.
7. **Simulated Response:** Observe simulated standby broadcast dispatches and nearby shelter HUD.
8. **Resolve Emergency:** Tap `I'm Safe (Resolve Emergency)` $\to$ transitions to `RECOVERED` $\to$ normalizes to `SAFE`.
9. **Safety Simulator:** Navigate to **Simulator** tab $\to$ choose **BEING FOLLOWED** $\to$ click **[ NEXT STEP ]** to demonstrate the complete escalation flow.

*(See [`docs/DEMO_CHECKLIST.md`](file:///c:/Users/vivek%20singh/Desktop/SAHELI-%20Women%20Safety/docs/DEMO_CHECKLIST.md) for quick presenter reference).*

---

## Future Scope (Production Roadmap)

The following capabilities represent future production integrations and are **not** present in this prototype:

- **Verified Emergency-Service Integration:** Official integration with national emergency helplines (such as 112 / ERSS in India).
- **Real-Time GPS & Map Engine:** Live location tracking via GPS and map routing APIs (e.g. Mapbox / OpenStreetMap).
- **Secure Backend & Cloud Database:** End-to-end encrypted backend infrastructure (Node.js / PostgreSQL).
- **Encrypted Incident Storage:** Tamper-evident evidentiary audit log with cryptographic signing.
- **Real SMS & Push Notification System:** Native SMS gateway (Twilio / Firebase Cloud Messaging) to alert guardians on real devices.
- **Verified Guardian Accounts:** Two-way guardian onboarding with biometric confirmation.
- **AI-Assisted Risk Detection:** Edge-based acoustic sensor analysis to detect screams, aggressive confrontation, or anomalous route deviation.

*(Clearly labeled as **FUTURE SCOPE ONLY**).*

---

## Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Validate linting (0 warnings enforced)
npm run lint

# 4. Build production bundle
npm run build
```
#   S a h e l i -   W o m e n   S a f e t y  
 #   S a h e l i -   W o m e n   S a f e t y  
 