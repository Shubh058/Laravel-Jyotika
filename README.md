# GovFeedback 360

GovFeedback 360 is a full-stack feedback platform for Government of India regional news stories.

The project is split into two deployable apps:

- `frontend/`: React + Vite app, deployable on Vercel.
- `backend/`: Laravel 12 REST API, deployable on a PHP/Laravel host with an online MySQL database.

## Local Setup

### Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

For local XAMPP MySQL, use this in `backend/.env`:

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=feedback_platform
DB_USERNAME=root
DB_PASSWORD=
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Local `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Deployment

### 1. Deploy Backend First

Use a Laravel/PHP host such as Render with Docker, Railway, Laravel Cloud, a VPS, or any host that supports PHP 8.2+, Composer, and MySQL.

The backend needs a public URL, for example:

```text
https://your-backend-domain.example
```

Set these production environment variables on the backend host:

```env
APP_NAME=Laravel
APP_ENV=production
APP_KEY=base64:generated-key
APP_DEBUG=false
APP_URL=https://your-backend-domain.example

FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-vercel-app.vercel.app

DB_CONNECTION=mysql
DB_HOST=your-online-mysql-host
DB_PORT=3306
DB_DATABASE=your-database-name
DB_USERNAME=your-database-user
DB_PASSWORD=your-database-password

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
```

Generate `APP_KEY` locally if needed:

```bash
php artisan key:generate --show
```

After deploy, run:

```bash
php artisan migrate --seed --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

The backend includes a `Dockerfile` for container hosts. It serves Laravel from `public/` using Apache and PHP 8.2.

### 2. Deploy Frontend On Vercel

Create a Vercel project using the `frontend/` directory.

Recommended Vercel settings:

```text
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Set this Vercel environment variable:

```env
VITE_API_BASE_URL=https://your-backend-domain.example/api
```

The included `frontend/vercel.json` sends all React routes back to `index.html`, so direct links like `/login`, `/news`, and `/dashboard` work after deployment.

### 3. Update Backend CORS After Vercel Deploy

When Vercel gives you the final frontend URL, update backend variables:

```env
FRONTEND_URL=https://your-final-vercel-url.vercel.app
CORS_ALLOWED_ORIGINS=https://your-final-vercel-url.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-final-vercel-url.vercel.app
```

Then clear and cache config again:

```bash
php artisan config:clear
php artisan config:cache
```

## Important Notes

- XAMPP and local MySQL only work on your laptop. Production needs an online MySQL database.
- The React app can be hosted on Vercel. The Laravel API should be hosted on a PHP/Laravel-friendly backend host.
- Do not commit `backend/.env`, `vendor/`, `node_modules/`, or `frontend/dist/`.

## Checks

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd backend
php artisan test
```
