# FinTrack - Personal Finance Web App

A full-stack personal finance management application for tracking income, expenses, budgets, and savings goals. Built with React 18, TypeScript, Node.js, Express, and PostgreSQL — deployed for free on Vercel + Render.

---

## Features

### Core
- **Authentication** – Register/Login with JWT, bcrypt password hashing, and email verification
- **Transaction Management** – Full CRUD for income and expense records with category tagging
- **Budget Management** – Set monthly spending limits per category and track usage in real time
- **Savings Goals** – Create financial goals, log contributions, and monitor progress toward targets

### Dashboard
- 6-month Income / Expense / Balance trend line chart
- Income vs. Expense comparison bar chart
- Expense breakdown pie chart
- Income breakdown pie chart
- Recent transactions list

### UX
- Dark mode with persistence
- Responsive design (desktop, tablet, mobile)
- Toast notifications for user feedback

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| UI / Forms | react-hook-form, react-hot-toast |
| Data Visualization | Recharts |
| HTTP Client | Axios |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT, bcrypt |
| Email | Nodemailer / SendGrid / Resend |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
Fintrack/
├── client/                     # React frontend
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── context/            # React context (auth, theme)
│       ├── pages/              # Route-level pages
│       ├── services/           # Axios API service layer
│       └── types/              # TypeScript interfaces
└── server/                     # Express backend
    ├── prisma/
    │   └── schema.prisma       # Database schema
    └── src/
        ├── controllers/        # Business logic
        ├── middleware/         # Auth middleware
        ├── routes/             # API route definitions
        ├── utils/              # Helpers & email utilities
        ├── seed.ts             # Default category seeder
        └── index.ts            # App entry point
```

---

## Database Schema

```
User ──< Transaction
User ──< Budget
User ──< Goal ──< GoalContribution
User ──< Category
```

| Model | Key Fields |
|-------|-----------|
| User | id, email, password, isVerified, createdAt |
| Category | id, name, type (INCOME/EXPENSE), userId |
| Transaction | id, amount, type, categoryId, userId, date, note |
| Budget | id, userId, categoryId, amount, month (unique per user/category/month) |
| Goal | id, userId, name, targetAmount, currentAmount, status (ACTIVE/COMPLETED/CANCELLED) |
| GoalContribution | id, goalId, amount, date, note |

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL v14+

### Backend Setup

```bash
cd server
npm install

# Configure environment
cp .env.example .env
```

`.env` variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/fintrack"
JWT_SECRET="your-secret-key"
PORT=3000
```

```bash
# Run migrations and seed default categories
npx prisma migrate dev
npx prisma generate
npm run seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd client
npm install

# Configure environment
cp .env.example .env
```

`.env` variables:

```env
VITE_API_URL=http://localhost:3000/api
```

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user info |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create custom category |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | Total income, expenses, balance |
| GET | `/api/dashboard/chart` | Pie chart data by category |
| GET | `/api/dashboard/trend` | 6-month trend data |
| GET | `/api/dashboard/recent` | Recent transactions |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | Get all budgets |
| POST | `/api/budgets` | Create budget |
| PUT | `/api/budgets/:id` | Update budget |
| DELETE | `/api/budgets/:id` | Delete budget |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/goals` | Get all goals |
| POST | `/api/goals` | Create goal |
| PUT | `/api/goals/:id` | Update goal |
| DELETE | `/api/goals/:id` | Delete goal |
| POST | `/api/goals/:id/contributions` | Add contribution |
| DELETE | `/api/goals/:goalId/contributions/:contributionId` | Remove contribution |

---

## Deployment

### Free Hosting (Vercel + Render)

**Backend → Render:**
1. Push `server/` to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Set environment variables from `.env.production.example`
4. Deploy — Render auto-detects Node.js

**Frontend → Vercel:**
1. Import the repo on [Vercel](https://vercel.com)
2. Set root directory to `client/`
3. Set `VITE_API_URL` to your Render backend URL
4. Deploy

**Total cost: $0/month**
