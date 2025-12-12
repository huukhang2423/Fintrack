import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  // Income categories
  { name: 'Salary', type: TransactionType.INCOME, icon: '💼', color: '#10B981' },
  { name: 'Freelance', type: TransactionType.INCOME, icon: '💻', color: '#3B82F6' },
  { name: 'Investment', type: TransactionType.INCOME, icon: '📈', color: '#8B5CF6' },
  { name: 'Business', type: TransactionType.INCOME, icon: '🏢', color: '#F59E0B' },
  { name: 'Other Income', type: TransactionType.INCOME, icon: '💰', color: '#6B7280' },

  // Expense categories
  { name: 'Food & Dining', type: TransactionType.EXPENSE, icon: '🍔', color: '#EF4444' },
  { name: 'Transportation', type: TransactionType.EXPENSE, icon: '🚗', color: '#F97316' },
  { name: 'Shopping', type: TransactionType.EXPENSE, icon: '🛍️', color: '#EC4899' },
  { name: 'Entertainment', type: TransactionType.EXPENSE, icon: '🎮', color: '#8B5CF6' },
  { name: 'Bills & Utilities', type: TransactionType.EXPENSE, icon: '📄', color: '#3B82F6' },
  { name: 'Healthcare', type: TransactionType.EXPENSE, icon: '🏥', color: '#06B6D4' },
  { name: 'Education', type: TransactionType.EXPENSE, icon: '📚', color: '#10B981' },
  { name: 'Travel', type: TransactionType.EXPENSE, icon: '✈️', color: '#F59E0B' },
  { name: 'Housing', type: TransactionType.EXPENSE, icon: '🏠', color: '#84CC16' },
  { name: 'Other Expenses', type: TransactionType.EXPENSE, icon: '💸', color: '#6B7280' },
];

export const createDefaultCategoriesForUser = async (userId: string): Promise<void> => {
  try {
    // Check if user already has categories
    const existingCategories = await prisma.category.count({
      where: { userId },
    });

    if (existingCategories > 0) {
      console.log(`User ${userId} already has categories, skipping...`);
      return;
    }

    // Create default categories for the user
    const categoriesToCreate = DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      userId,
      isDefault: false, // User-specific categories
    }));

    await prisma.category.createMany({
      data: categoriesToCreate,
    });

    console.log(`✅ Created ${categoriesToCreate.length} default categories for user ${userId}`);
  } catch (error) {
    console.error('Error creating default categories:', error);
    throw error;
  }
};
