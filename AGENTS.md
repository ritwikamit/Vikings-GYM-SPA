# AGENTS.md — Vikings-GYM-SPA

Shared context for AI coding assistants (opencode, Antigravity, etc.). Read this first.
Keep this file up to date when the setup changes. Always also read `WORKLOG.md` for recent changes.

## Project
- GitHub: https://github.com/ritwikamit/Vikings-GYM-SPA (default branch: `main`)
- Monorepo — two apps + Atlas DB:

| Part | Stack | Location | Run | URL |
|---|---|---|---|---|
| Frontend | Vite 6 + React 19 + TS + Tailwind 4 + React Router 7 + TanStack Query | repo root | `npm run dev` | http://localhost:3000 |
| Backend | Flask 3.1 + MongoEngine + JWT + SocketIO + APScheduler + eventlet | `backend/` | `python run.py` (use `backend/venv`) | http://localhost:5000 |
| Database | MongoDB Atlas | — | — | `vikings_erp` database |

## Entry points / key files
- Frontend: `index.html`, `src/main.tsx`, `src/App.tsx` (routing + console layout), `src/components/AuthGateway.tsx` (login/register UI), `src/api/client.ts` (axios + base URL + token refresh), `src/api/auth.ts`
- Backend: `backend/run.py` (entry), `backend/app/__init__.py` (app factory + CORS), `backend/app/config.py` (env config), `backend/app/routes/auth.py` (login/register), `backend/app/services/auth_service.py`, `backend/app/models/user.py`
- Deployment: `vercel.json` (SPA rewrites), `render.yaml` (backend blueprint)

## Scripts (root)
- `npm run dev` (vite on :3000) · `npm run build` · `npm run lint` (tsc --noEmit) · `npm run preview`
- `clean` uses `rm -rf` — broken on Windows PowerShell, ignore it.

## Backend setup (Windows local)
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env      # set MONGODB_URI, FRONTEND_URL
python -m seed.seed_data    # requires: $env:PYTHONIOENCODING="utf-8" (emoji output)
python run.py               # server on :5000
```
- `gunicorn` cannot run on Windows (needs `fcntl`) — use `python run.py` locally. Render uses Linux.
- Local seeded logins: `admin@vikingsgym.in/Admin@123` (SUPER_ADMIN), `vikram@vikingsgym.in/Owner@123`, `priya@vikingsgym.in/Recep@123`, `arjun@vikingsgym.in/Trainer@123`, `rahul.d@gmail.com/Member@123`.

## Environment variables
- **Local `backend/.env`:** `MONGODB_URI`, `FRONTEND_URL=http://localhost:3000`, `SECRET_KEY`, `JWT_SECRET_KEY`
- **Local root `.env.local`:** `VITE_API_URL=http://localhost:5000/api`
- **Production (dashboards only, never git):** Render = `MONGODB_URI`, `FRONTEND_URL=https://vikingsgymspa.vercel.app`, `JWT_SECRET_KEY`, `FLASK_ENV=production`, `PYTHON_VERSION=3.11.0`; Vercel = `VITE_API_URL=https://vikings-gym-backend.onrender.com/api`
- `.env*` is gitignored. Never commit secrets or connection strings.

## Deployment flow
- Push to GitHub `main` → **Render** auto-builds/deploys backend → **Vercel** auto-builds/deploys frontend → **Atlas** data untouched.
- Live: frontend https://vikingsgymspa.vercel.app · backend https://vikings-gym-backend.onrender.com
- Render service: `vikings-gym-backend` (dashboard: https://dashboard.render.com/web/srv-d8nfos3tqb8s73d51ddg)
- Vercel project: `vikings-gym-spa` (dashboard: https://vercel.com/ritwikamits-projects/vikings-gym-spa)
- Atlas cluster: `cluster0.elk8qoz.mongodb.net`, DB user `ritwik014017_db_user`, app DB **`vikings_erp`** (NOT `vikings_gym`).

## Known issues / gotchas (IMPORTANT)
1. **Deploy crash history:** `render.yaml` env-var edits on the existing service caused "Exited with status 1". Keep `render.yaml` minimal; prefer editing vars in the Render dashboard. Runtime fixes live in code (config.py accepts `MONGODB_URI` **or** `MONGO_URI`).
2. **eventlet:** `run.py` has `eventlet.monkey_patch()` at top and requirements pin `eventlet==0.39.0` + `setuptools>=68` — required for Render/gunicorn startup.
3. **CORS:** `backend/app/__init__.py` whitelists localhost ports + `https://vikingsgymspa.vercel.app`. Add new prod origins there AND in Render `FRONTEND_URL`.
4. **Atlas network access:** must allow `0.0.0.0/0` (Render egress IPs rotate).
5. **Production DB users:** `vikings_erp.users` currently contains `test@example.com` (MEMBER), `verifytest100@example.com` (MEMBER, test), `ritwik014017@gmail.com` (SUPER_ADMIN). Don't modify production data without explicit permission.
6. **Role-based UI:** MEMBER → `/member` (minimal self-service page). Staff (SUPER_ADMIN/GYM_OWNER/RECEPTIONIST/TRAINER) → `/erp` full dashboard. `register` creates a `User` but NOT a linked `Member` profile.
7. **Windows:** `$env:PYTHONIOENCODING="utf-8"` required before running seed or any Python with emoji output.
8. **Git identity:** repo-local config is `Ritwik Amit <ritwik014017@gmail.com>`. Push auth via Git Credential Manager (browser login).

## Workflow for AI assistants
- Start every task by reading this file + `WORKLOG.md`.
- After finishing work, append a short entry to `WORKLOG.md` (date, what changed, files, deploy status, how to verify) and commit/push so the other tool sees it.
- When asked for handoff context, point to `AGENTS.md` + `WORKLOG.md`.
