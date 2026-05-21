# 360-Degree Feedback Web Platform

This is a complete, production-grade web application for collecting and analyzing 360-degree feedback on Government of India news stories from regional media. 

The project follows a clean architecture separating the Laravel 11 backend and React.js + Vite frontend.

## 🚀 Technology Stack

**Frontend:**
- React.js + Vite
- Tailwind CSS v4
- Axios for API Communication
- React Router DOM
- Chart.js & React-Chartjs-2 for Analytics
- Lucide React for Icons

**Backend:**
- Laravel 11
- RESTful APIs
- Laravel Sanctum for secure token-based authentication
- MySQL Database
- Service-Repository Pattern
- Eloquent ORM

---

## 📂 Project Structure
```
/
├── backend/            # Laravel 11 Application
│   ├── app/            # Models, Controllers, Services
│   ├── routes/         # API Routes (routes/api.php)
│   ├── database/       # Migrations & Seeders
│   └── .env            # Environment Configuration
│
└── frontend/           # React + Vite Application
    ├── src/
    │   ├── components/ # Reusable UI Components
    │   ├── pages/      # Route Components (Dashboard, Analytics, etc.)
    │   ├── context/    # React Context (AuthContext)
    │   ├── services/   # Axios API configurations
    │   └── index.css   # Tailwind CSS Configuration
    └── package.json    # Dependencies
```

---

## ⚙️ Installation & Setup Guide

### 1. Database Setup (MySQL)
Ensure you have MySQL installed and running.
Create a new database for the application:
```sql
CREATE DATABASE feedback_platform;
```

### 2. Backend Setup (Laravel)
```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Configure your database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=feedback_platform
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Generate App Key
php artisan key:generate

# Run Migrations
php artisan migrate

# Seed Database (Optional - if seeders are implemented)
# php artisan db:seed

# Start the Laravel development server
php artisan serve
```
The backend API will run on `http://127.0.0.1:8000`.

### 3. Frontend Setup (React)
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend will run on `http://localhost:5173`.

---

## 🛡️ Authentication & Roles
The platform supports Role-Based Access Control (RBAC):
1. **User (Citizen)**: Can view news stories and submit feedback.
2. **Analyst**: Can view the Analytics Dashboard and Regional Engagement.
3. **Admin**: Can manage news, view all feedback, and access analytics.

## 📊 Analytics Dashboard (USP)
The Analytics Dashboard leverages Chart.js to provide real-time visual insights:
- **Doughnut Chart**: Overall Sentiment Distribution
- **Bar Chart**: Regional Engagement (Feedback per Region)
- **Line Chart**: 30-Day Feedback Trends

## 💡 Code Quality & Architecture
- Follows SOLID principles and Clean Architecture.
- API requests are intercepted globally to attach Bearer tokens.
- Tailwind v4 handles responsive design directly in `index.css`.
- Meaningful variable names, zero generic "lorem ipsum".
