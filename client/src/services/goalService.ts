import api from './api';
import { Goal, GoalInput, ContributionInput, GoalContribution } from '../types';

export const goalService = {
  // Get all goals (with optional status filter)
  async getGoals(status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'): Promise<Goal[]> {
    const response = await api.get<{ goals: Goal[] }>('/goals', {
      params: status ? { status } : {},
    });
    return response.data.goals;
  },

  // Get a single goal by ID
  async getGoal(id: string): Promise<Goal> {
    const response = await api.get<{ goal: Goal }>(`/goals/${id}`);
    return response.data.goal;
  },

  // Create a new goal
  async createGoal(data: GoalInput): Promise<Goal> {
    const response = await api.post<{ message: string; goal: Goal }>('/goals', data);
    return response.data.goal;
  },

  // Update a goal
  async updateGoal(id: string, data: Partial<GoalInput>): Promise<Goal> {
    const response = await api.put<{ message: string; goal: Goal }>(`/goals/${id}`, data);
    return response.data.goal;
  },

  // Delete a goal
  async deleteGoal(id: string): Promise<void> {
    await api.delete(`/goals/${id}`);
  },

  // Add a contribution to a goal
  async addContribution(goalId: string, data: ContributionInput): Promise<{ contribution: GoalContribution; goal: Goal }> {
    const response = await api.post<{
      message: string;
      contribution: GoalContribution;
      goal: Goal;
    }>(`/goals/${goalId}/contributions`, data);
    return {
      contribution: response.data.contribution,
      goal: response.data.goal,
    };
  },

  // Remove a contribution from a goal
  async removeContribution(goalId: string, contributionId: string): Promise<Goal> {
    const response = await api.delete<{ message: string; goal: Goal }>(
      `/goals/${goalId}/contributions/${contributionId}`
    );
    return response.data.goal;
  },

  // Update goal status
  async updateGoalStatus(id: string, status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'): Promise<Goal> {
    const response = await api.patch<{ message: string; goal: Goal }>(
      `/goals/${id}/status`,
      { status }
    );
    return response.data.goal;
  },
};
