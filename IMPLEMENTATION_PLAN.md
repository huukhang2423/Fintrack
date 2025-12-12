# FinTrack - Implementation Plan

## Features to Implement

### 1. Budget Management (Quản lý ngân sách)
- Set monthly budgets per category
- Track spending vs budget with progress bars
- Warning system (75%, 90%, 100%+)
- **Backend**: Already complete! Just need frontend

### 2. Advanced Reports & Charts (Báo cáo nâng cao)
- Trend chart (line chart showing income vs expense over time)
- Monthly comparison (bar chart)
- Date range filters
- CSV export

### 3. Goals & Savings (Mục tiêu tiết kiệm)
- Create savings goals with target amounts
- Track progress with contributions
- Deadline tracking
- Status management (Active, Completed, Cancelled)

## Implementation Order

### Phase 1: Fix Dark Mode Issues (Day 1)
- Fix Transactions page text colors
- Fix Modal component dark mode
- Fix TransactionModal labels

### Phase 2: Budget Management (Days 2-3)
- Create budgetService.ts
- Create BudgetCard component
- Create BudgetModal component
- Create Budgets page
- Add routing and navigation

### Phase 3: Advanced Reports (Days 4-6)
- Backend: Add trend and comparison endpoints
- Create DateRangePicker component
- Create chart components (TrendChart, MonthlyComparisonChart)
- Create Reports page
- Add CSV export functionality

### Phase 4: Goals & Savings (Days 7-10)
- Database: Add Goal and GoalContribution models
- Backend: Create goalController and routes
- Frontend: Create goal service
- Create GoalCard component
- Create goal modals (Form, Details)
- Create Goals page

## Quick Start: Budget Management

Budget backend is ALREADY COMPLETE:
- API endpoints exist: GET /api/budgets, POST /api/budgets, DELETE /api/budgets
- Database model exists
- Backend calculates spent/remaining/percentage

We just need:
1. Create budgetService.ts (30 min)
2. Create Budgets page with cards (3 hours)
3. Add routing (15 min)

This is the **quickest win** for adding value to FinTrack!
