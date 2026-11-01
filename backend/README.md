# SAHELI — Backend Service Architecture (Future Implementation)

> **Current Status:** `FUTURE / NOT IMPLEMENTED`
> In the current milestone, SAHELI is a 100% frontend prototype using local state and simulated responses.

---

## Planned Architecture

When backend services are implemented, this directory will host the Node.js/Express REST and WebSocket server:

```
backend/
├── src/
│   ├── config/          # Environment variables, DB connection pool, security secrets
│   ├── controllers/     # Request handlers (auth, safewalk, guardians, safePlaces, incidents)
│   ├── middleware/      # JWT auth, rate limiting, request validation, error handler
│   ├── routes/          # API route definitions (/api/v1/...)
│   ├── services/        # Business logic, SMS gateway integrations, alert broadcaster
│   ├── utils/           # Encryption, logger, geo-distance calculations
│   ├── validators/      # Schema validation rules (Joi / Zod)
│   └── server.js        # Server bootstrap and lifecycle entry point
├── package.json
└── README.md
```

## Planned API Endpoints

- `POST /api/v1/auth/register` — User account registration
- `POST /api/v1/auth/login` — Authentication with JWT
- `POST /api/v1/safewalk/start` — Initiate companion walk
- `POST /api/v1/safewalk/checkin` — Acknowledge periodic check-in
- `POST /api/v1/safety/escalate` — Transition safety state
- `POST /api/v1/guardians/alert` — Trigger SMS and push notification to guardians
- `GET  /api/v1/places/nearby` — Query verified havens by GPS coordinates
- `POST /api/v1/incidents/resolve` — Mark incident safe and archive timeline
