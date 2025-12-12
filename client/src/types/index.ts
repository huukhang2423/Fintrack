export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
  requiresVerification?: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon?: string;
  color?: string;
  isDefault: boolean;
  userId?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  categoryId: string;
  category: Category;
}

export interface TransactionInput {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description?: string;
  date: string;
  categoryId: string;
}

export interface DashboardSummary {
  income: number;
  expense: number;
  balance: number;
  transactionCount: number;
  month: number;
  year: number;
}

export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export interface TrendDataItem {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface Budget {
  id: string;
  amount: number;
  month: number;
  year: number;
  spent?: number;
  remaining?: number;
  percentage?: number;
  category: Category;
}

export interface BudgetInput {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  percentage?: number;
  remaining?: number;
  contributions: GoalContribution[];
}

export interface GoalContribution {
  id: string;
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
  goalId: string;
}

export interface GoalInput {
  name: string;
  description?: string;
  targetAmount: number;
  deadline?: string;
}

export interface ContributionInput {
  amount: number;
  note?: string;
  date?: string;
}
