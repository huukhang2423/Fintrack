import { Response } from 'express';
import { AuthRequest } from '../types';
import { PrismaClient, GoalStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Get all goals for the authenticated user
export const getGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const goals = await prisma.goal.findMany({
      where: {
        userId,
        ...(status && { status: status as GoalStatus }),
      },
      include: {
        contributions: {
          orderBy: { date: 'desc' },
        },
      },
      orderBy: [
        { status: 'asc' }, // ACTIVE first
        { deadline: 'asc' }, // Earliest deadline first
      ],
    });

    // Calculate progress percentage for each goal
    const goalsWithProgress = goals.map((goal) => ({
      ...goal,
      percentage: Number(goal.targetAmount) > 0
        ? (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100
        : 0,
      remaining: Number(goal.targetAmount) - Number(goal.currentAmount),
    }));

    res.json({ goals: goalsWithProgress });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

// Get a single goal by ID
export const getGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const goal = await prisma.goal.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        contributions: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const goalWithProgress = {
      ...goal,
      percentage: Number(goal.targetAmount) > 0
        ? (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100
        : 0,
      remaining: Number(goal.targetAmount) - Number(goal.currentAmount),
    };

    res.json({ goal: goalWithProgress });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ error: 'Failed to fetch goal' });
  }
};

// Create a new goal
export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { name, description, targetAmount, deadline } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!name || !targetAmount || targetAmount <= 0) {
      return res.status(400).json({ error: 'Name and valid target amount are required' });
    }

    const goal = await prisma.goal.create({
      data: {
        name,
        description,
        targetAmount,
        deadline: deadline ? new Date(deadline) : null,
        userId,
      },
      include: {
        contributions: true,
      },
    });

    res.status(201).json({
      message: 'Goal created successfully',
      goal: {
        ...goal,
        percentage: 0,
        remaining: Number(goal.targetAmount),
      },
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
};

// Update a goal
export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { name, description, targetAmount, deadline, status } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!existingGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(targetAmount && { targetAmount }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(status && { status }),
      },
      include: {
        contributions: {
          orderBy: { date: 'desc' },
        },
      },
    });

    const goalWithProgress = {
      ...goal,
      percentage: Number(goal.targetAmount) > 0
        ? (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100
        : 0,
      remaining: Number(goal.targetAmount) - Number(goal.currentAmount),
    };

    res.json({
      message: 'Goal updated successfully',
      goal: goalWithProgress,
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
};

// Delete a goal
export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!existingGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await prisma.goal.delete({
      where: { id },
    });

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};

// Add a contribution to a goal
export const addContribution = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { amount, note, date } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Check if goal exists and belongs to user
    const goal = await prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    if (goal.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Cannot add contributions to inactive goals' });
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Find or create "Savings" category
      let savingsCategory = await tx.category.findFirst({
        where: {
          name: 'Savings',
          type: 'EXPENSE',
          OR: [
            { userId: userId },
            { isDefault: true }
          ]
        }
      });

      if (!savingsCategory) {
        savingsCategory = await tx.category.create({
          data: {
            name: 'Savings',
            type: 'EXPENSE',
            icon: '💰',
            color: '#10b981',
            isDefault: false,
            userId: userId,
          }
        });
      }

      // Create contribution
      const contribution = await tx.goalContribution.create({
        data: {
          amount,
          note,
          date: date ? new Date(date) : new Date(),
          goalId: id,
        },
      });

      // Create corresponding EXPENSE transaction to reduce balance
      await tx.transaction.create({
        data: {
          amount,
          type: 'EXPENSE',
          description: note || `Savings for: ${goal.name}`,
          date: date ? new Date(date) : new Date(),
          userId: userId!,
          categoryId: savingsCategory.id,
        }
      });

      // Update goal's current amount
      const newCurrentAmount = Number(goal.currentAmount) + Number(amount);
      const updatedGoal = await tx.goal.update({
        where: { id },
        data: {
          currentAmount: newCurrentAmount,
          // Auto-complete if target reached
          status: newCurrentAmount >= Number(goal.targetAmount) ? 'COMPLETED' : goal.status,
        },
        include: {
          contributions: {
            orderBy: { date: 'desc' },
          },
        },
      });

      return { contribution, goal: updatedGoal };
    });

    const goalWithProgress = {
      ...result.goal,
      percentage: Number(result.goal.targetAmount) > 0
        ? (Number(result.goal.currentAmount) / Number(result.goal.targetAmount)) * 100
        : 0,
      remaining: Number(result.goal.targetAmount) - Number(result.goal.currentAmount),
    };

    res.status(201).json({
      message: 'Contribution added successfully',
      contribution: result.contribution,
      goal: goalWithProgress,
    });
  } catch (error) {
    console.error('Add contribution error:', error);
    res.status(500).json({ error: 'Failed to add contribution' });
  }
};

// Remove a contribution from a goal
export const removeContribution = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id, contributionId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if goal exists and belongs to user
    const goal = await prisma.goal.findFirst({
      where: { id, userId },
      include: {
        contributions: {
          where: { id: contributionId },
        },
      },
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const contribution = goal.contributions[0];
    if (!contribution) {
      return res.status(404).json({ error: 'Contribution not found' });
    }

    // Use transaction to ensure atomicity
    const updatedGoal = await prisma.$transaction(async (tx) => {
      // Find Savings category
      const savingsCategory = await tx.category.findFirst({
        where: {
          name: 'Savings',
          type: 'EXPENSE',
          OR: [
            { userId: userId },
            { isDefault: true }
          ]
        }
      });

      // Delete contribution
      await tx.goalContribution.delete({
        where: { id: contributionId },
      });

      // Create INCOME transaction to return money to balance
      if (savingsCategory) {
        await tx.transaction.create({
          data: {
            amount: contribution.amount,
            type: 'INCOME',
            description: `Withdrawal from savings: ${goal.name}`,
            date: new Date(),
            userId: userId!,
            categoryId: savingsCategory.id,
          }
        });
      }

      // Update goal's current amount
      const newCurrentAmount = Math.max(0, Number(goal.currentAmount) - Number(contribution.amount));
      return await tx.goal.update({
        where: { id },
        data: {
          currentAmount: newCurrentAmount,
          // Revert to ACTIVE if was completed
          status: goal.status === 'COMPLETED' ? 'ACTIVE' : goal.status,
        },
        include: {
          contributions: {
            orderBy: { date: 'desc' },
          },
        },
      });
    });

    const goalWithProgress = {
      ...updatedGoal,
      percentage: Number(updatedGoal.targetAmount) > 0
        ? (Number(updatedGoal.currentAmount) / Number(updatedGoal.targetAmount)) * 100
        : 0,
      remaining: Number(updatedGoal.targetAmount) - Number(updatedGoal.currentAmount),
    };

    res.json({
      message: 'Contribution removed successfully',
      goal: goalWithProgress,
    });
  } catch (error) {
    console.error('Remove contribution error:', error);
    res.status(500).json({ error: 'Failed to remove contribution' });
  }
};

// Update goal status
export const updateGoalStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!status || !['ACTIVE', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!existingGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: { status },
      include: {
        contributions: {
          orderBy: { date: 'desc' },
        },
      },
    });

    const goalWithProgress = {
      ...goal,
      percentage: Number(goal.targetAmount) > 0
        ? (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100
        : 0,
      remaining: Number(goal.targetAmount) - Number(goal.currentAmount),
    };

    res.json({
      message: 'Goal status updated successfully',
      goal: goalWithProgress,
    });
  } catch (error) {
    console.error('Update goal status error:', error);
    res.status(500).json({ error: 'Failed to update goal status' });
  }
};
