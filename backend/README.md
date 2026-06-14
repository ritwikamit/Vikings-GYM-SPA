# Vikings Gym & Spa — Flask Backend

Production-ready REST API backend for the Vikings Gym & Spa ERP system.

## Tech Stack

- **Python 3.12+** with **Flask**
- **MongoDB** via **MongoEngine** ODM
- **JWT Authentication** (Flask-JWT-Extended)
- **Real-time** via Flask-SocketIO
- **Scheduled Jobs** via APScheduler
- **Payments** via Razorpay SDK
- **PDF Generation** via ReportLab

## Quick Start

### Prerequisites
- Python 3.12+
- MongoDB running on `localhost:27017`

### Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

# Seed database with demo data
python -m seed.seed_data

# Start the server
python run.py
```

Server runs at **http://localhost:5000**

### Docker Setup

```bash
docker-compose up -d
```

## Default Login

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@vikingsgym.in | Admin@123 |
| Gym Owner | vikram@vikingsgym.in | Owner@123 |
| Receptionist | priya@vikingsgym.in | Recep@123 |
| Trainer | arjun@vikingsgym.in | Trainer@123 |
| Member | rahul.d@gmail.com | Member@123 |

## API Endpoints

| Module | Prefix | Endpoints |
|--------|--------|-----------|
| Auth | `/api/auth` | login, register, me, refresh, logout, change-password, forgot/reset |
| Members | `/api/members` | CRUD + QR, membership, attendance, payments, progress, workouts, diet |
| Memberships | `/api/memberships` | CRUD + renew, upgrade, freeze, cancel, expiring, expired, plans |
| Attendance | `/api/attendance` | checkin, checkout, today, analytics, heatmap, peak-hours |
| Payments | `/api/payments` | offline, razorpay create/verify, invoice PDF, analytics, apply-coupon |
| Trainers | `/api/trainers` | CRUD + clients, performance, schedule |
| Leads | `/api/leads` | CRUD + status, kanban, followup, analytics |
| Workouts | `/api/workouts` | CRUD + assign, library |
| Diet Plans | `/api/diet` | CRUD + assign |
| Progress | `/api/progress` | CRUD + photos, chart |
| PT | `/api/pt` | packages CRUD, sessions CRUD, log, analytics |
| Expenses | `/api/expenses` | CRUD + analytics/P&L |
| Inventory | `/api/inventory` | CRUD + stock-in/out, low-stock, POS bill |
| Lockers | `/api/lockers` | list, add, assign, release, available |
| Equipment | `/api/equipment` | CRUD + maintenance-due, service |
| Announcements | `/api/announcements` | CRUD + publish, schedule |
| Notifications | `/api/notifications` | list, read, read-all, delete, unread-count |
| Referrals | `/api/referrals` | list, my, validate, convert |
| Coupons | `/api/coupons` | CRUD + validate |
| Analytics | `/api/analytics` | dashboard, revenue, members, attendance, leads, trainers, expenses, pt |
| Audit Logs | `/api/audit` | list with filters |
| Dashboard | `/api/dashboard` | stats, alerts |

## API Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "pages": 8
  }
}
```

## Architecture

```
backend/
├── app/
│   ├── __init__.py          # App factory
│   ├── config.py            # Configuration
│   ├── extensions.py        # Flask extensions
│   ├── models/              # 22 MongoDB models
│   ├── routes/              # 22 route blueprints
│   ├── services/            # 6 business services
│   ├── middleware/           # RBAC, audit, rate limiting
│   └── utils/               # Response, validation, helpers
├── seed/                    # Database seeding
├── run.py                   # Entry point
├── Dockerfile
└── docker-compose.yml
```

## RBAC Roles

- **SUPER_ADMIN** — Full access
- **GYM_OWNER** — Full access
- **RECEPTIONIST** — Members, attendance, payments, leads, inventory
- **TRAINER** — Workouts, diet, progress, PT sessions
- **MEMBER** — Self-only access

## Scheduled Jobs (Daily at 8:00 AM)

1. Membership expiry alerts (7, 3, 1, 0 days)
2. Birthday wishes
3. Equipment maintenance due
4. Low stock alerts
5. Inactive member alerts (7+ days)
