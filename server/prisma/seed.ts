import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default categories
  const categories = [
    // Income categories
    { name: 'Salary', type: TransactionType.INCOME, icon: '💼', color: '#10B981', isDefault: true },
    { name: 'Freelance', type: TransactionType.INCOME, icon: '💻', color: '#3B82F6', isDefault: true },
    { name: 'Investment', type: TransactionType.INCOME, icon: '📈', color: '#8B5CF6', isDefault: true },
    { name: 'Business', type: TransactionType.INCOME, icon: '🏢', color: '#F59E0B', isDefault: true },
    { name: 'Other Income', type: TransactionType.INCOME, icon: '💰', color: '#6B7280', isDefault: true },

    // Expense categories
    { name: 'Food & Dining', type: TransactionType.EXPENSE, icon: '🍔', color: '#EF4444', isDefault: true },
    { name: 'Transportation', type: TransactionType.EXPENSE, icon: '🚗', color: '#F97316', isDefault: true },
    { name: 'Shopping', type: TransactionType.EXPENSE, icon: '🛍️', color: '#EC4899', isDefault: true },
    { name: 'Entertainment', type: TransactionType.EXPENSE, icon: '🎮', color: '#8B5CF6', isDefault: true },
    { name: 'Bills & Utilities', type: TransactionType.EXPENSE, icon: '📄', color: '#3B82F6', isDefault: true },
    { name: 'Healthcare', type: TransactionType.EXPENSE, icon: '🏥', color: '#06B6D4', isDefault: true },
    { name: 'Education', type: TransactionType.EXPENSE, icon: '📚', color: '#10B981', isDefault: true },
    { name: 'Travel', type: TransactionType.EXPENSE, icon: '✈️', color: '#F59E0B', isDefault: true },
    { name: 'Housing', type: TransactionType.EXPENSE, icon: '🏠', color: '#84CC16', isDefault: true },
    { name: 'Other Expenses', type: TransactionType.EXPENSE, icon: '💸', color: '#6B7280', isDefault: true },
  ];

  for (const category of categories) {
    const existing = await prisma.category.findFirst({
      where: {
        name: category.name,
        userId: null, // Default categories have no userId
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: category,
      });
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📦 Created ${categories.length} categories`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
