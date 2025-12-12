import api from './api';
import { Budget } from '../types';

interface BudgetInput {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}

export const budgetService = {
  /**
   * Get all budgets for a specific month and year
   * Returns budgets with calculated spent, remaining, and percentage
   */
  async getBudgets(month?: number, year?: number): Promise<Budget[]> {
    const response = await api.get<{ budgets: Budget[] }>('/budgets', {
      params: { month, year },
    });
    return response.data.budgets;
  },

  /**
   * Create a new budget or update existing one (upsert)
   * Backend handles checking if budget exists for the category/month/year combination
   */
  async createOrUpdateBudget(data: BudgetInput): Promise<Budget> {
    const response = await api.post<{ message: string; budget: Budget }>(
      '/budgets',
      data
    );
    return response.data.budget;
  },

  /**
   * Delete a budget by ID
   */
  async deleteBudget(id: string): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },
};
