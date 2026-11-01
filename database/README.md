# SAHELI — Database Architecture (Future Implementation)

> **Current Status:** `FUTURE / NOT IMPLEMENTED`
> In the current milestone, SAHELI is a 100% frontend prototype using mock data and local React state. No database is connected, and no database software (PostgreSQL, MongoDB, MySQL, SQLite, Prisma, Mongoose) is installed or executed.

---

## Purpose of this Directory

This directory is reserved for the target persistence layer when the backend service is integrated.

```
database/
├── schema/       # Target SQL/DDL schema definitions or ORM models
├── seed/         # Initial development seed fixtures matching mock data
├── migrations/   # Incremental schema evolution and versioned migration scripts
└── README.md     # Architecture documentation
```

---

## Planned Data Models

When implemented, the schema will model the following primary domain entities:

### 1. `users`
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `phone` (VARCHAR, Unique)
- `emergency_pin` (HASHED)
- `created_at` (TIMESTAMP)

### 2. `guardians`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `name` (VARCHAR)
- `relationship` (VARCHAR)
- `phone` (VARCHAR)
- `priority` (ENUM: `'Primary'`, `'Secondary'`)
- `status` (ENUM: `'Available'`, `'Busy'`, `'Offline'`)

### 3. `safewalk_sessions`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `origin` (VARCHAR / GEOPOLYGON)
- `destination` (VARCHAR / GEOPOLYGON)
- `expected_arrival` (TIMESTAMP)
- `checkin_interval_minutes` (INT)
- `status` (ENUM: `'Active'`, `'Completed'`, `'Escalated'`)

### 4. `safe_places`
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `category` (VARCHAR)
- `address` (TEXT)
- `latitude` (FLOAT)
- `longitude` (FLOAT)
- `is_verified` (BOOLEAN)
- `features` (JSON / TEXT[])

### 5. `incident_logs`
- `id` (UUID, Primary Key)
- `session_id` (UUID, Nullable Foreign Key)
- `safety_state` (ENUM: `'SAFE'`, `'CAUTION'`, `'THREAT'`, `'EMERGENCY'`, `'RECOVERED'`)
- `event_title` (VARCHAR)
- `event_description` (TEXT)
- `timestamp` (TIMESTAMP)
