# FinTrack - Personal Finance Web App

A user-friendly web application designed to help individuals, particularly students and young professionals, track their daily income and expenses.

## Team Members
- Nguyễn Hữu Khang - ITDSIU21002
- Nguyễn Bá Duy - ITDSIU21014
- Phạm Huỳnh Thanh Quân - ITDSIU21110
- Đặng Thái Sơn - ITDSIU21115
- Nguyễn Thị Mai Phương - ITDSIU20080

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Recharts (Data Visualization)
- React Router DOM
- Axios

### Backend
- Node.js + Express + TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt

## Project Structure

```
ITPM_PROJ/
├── client/          # Frontend React App
├── server/          # Backend Express API
└── README.md
```

## Features

### ✅ Implemented Features
- **User Authentication** - Register/Login with JWT & Email Verification
- **Transaction Management** - Full CRUD operations for income/expenses
- **Budget Management** - Set and track monthly budgets by category
- **Goals & Savings** - Create savings goals and track progress
- **Advanced Dashboard**:
  - 6-Month Income/Expense/Balance Trend Chart
  - Income vs Expense Comparison Bar Chart
  - Expense Breakdown Pie Chart
  - Income Breakdown Pie Chart
  - Recent Transactions List
- **Dark Mode** - Full dark mode support with theme persistence
- **Responsive Design** - Works on desktop, tablet, and mobile

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/fintrack"
JWT_SECRET="your-secret-key"
PORT=3000
```

4. Run Prisma migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Seed default categories:
```bash
npm run seed
```

6. Start server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create custom category

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary
- `GET /api/dashboard/chart` - Get chart data
- `GET /api/dashboard/trend` - Get 6-month trend data
- `GET /api/dashboard/recent` - Get recent transactions

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Goals
- `GET /api/goals` - Get all goals
- `GET /api/goals/:id` - Get single goal
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/contributions` - Add contribution
- `DELETE /api/goals/:goalId/contributions/:contributionId` - Remove contribution

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions to Render + Vercel (100% FREE).

Quick summary:
1. **Backend:** Deploy to Render.com with PostgreSQL
2. **Frontend:** Deploy to Vercel
3. **Total Cost:** $0/month 🎉

## License

This is an academic project for educational purposes.
