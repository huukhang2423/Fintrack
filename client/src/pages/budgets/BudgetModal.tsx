import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { budgetService } from '../../services/budgetService';
import { Budget, Category } from '../../types';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  budget: Budget | null;
  categories: Category[];
  currentMonth: number;
  currentYear: number;
}

interface BudgetFormData {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}

const BudgetModal = ({
  isOpen,
  onClose,
  onSuccess,
  budget,
  categories,
  currentMonth,
  currentYear,
}: BudgetModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    defaultValues: {
      month: currentMonth,
      year: currentYear,
    },
  });

  useEffect(() => {
    if (budget) {
      reset({
        categoryId: budget.category.id,
        amount: Number(budget.amount),
        month: budget.month,
        year: budget.year,
      });
    } else {
      reset({
        month: currentMonth,
        year: currentYear,
        amount: 0,
        categoryId: '',
      });
    }
  }, [budget, reset, currentMonth, currentYear]);

  const onSubmit = async (data: BudgetFormData) => {
    try {
      await budgetService.createOrUpdateBudget(data);
      toast.success(
        budget ? 'Budget updated successfully' : 'Budget created successfully'
      );
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  // Filter to show only EXPENSE categories (budgets don't make sense for income)
  const expenseCategories = categories.filter((cat) => cat.type === 'EXPENSE');

  // Generate month options
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  // Generate year options (current year and next 2 years)
  const currentYearValue = new Date().getFullYear();
  const years = [currentYearValue, currentYearValue + 1, currentYearValue + 2];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budget ? 'Edit Budget' : 'Set New Budget'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            {...register('categoryId', { required: 'Category is required' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            disabled={!!budget} // Can't change category when editing
          >
            <option value="">Select a category</option>
            {expenseCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Amount Input */}
        <Input
          label="Budget Amount (VND)"
          type="number"
          step="1000"
          error={errors.amount?.message}
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 1, message: 'Amount must be greater than 0' },
          })}
        />

        {/* Month and Year */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Month
            </label>
            <select
              {...register('month', {
                required: 'Month is required',
                valueAsNumber: true,
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Year
            </label>
            <select
              {...register('year', {
                required: 'Year is required',
                valueAsNumber: true,
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Set a spending limit for this category. You'll be notified when approaching or exceeding this amount.
        </p>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {budget ? 'Update Budget' : 'Create Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetModal;
