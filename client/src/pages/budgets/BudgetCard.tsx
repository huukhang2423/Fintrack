import { Budget } from '../../types';
import Card from '../../components/ui/Card';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

const BudgetCard = ({ budget, onEdit, onDelete }: BudgetCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const percentage = budget.percentage || 0;

  // Progress bar color based on percentage
  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-red-600 dark:bg-red-500';
    if (percentage >= 91) return 'bg-orange-500 dark:bg-orange-400';
    if (percentage >= 71) return 'bg-yellow-500 dark:bg-yellow-400';
    return 'bg-green-600 dark:bg-green-500';
  };

  const getWarningIcon = () => {
    if (percentage >= 100) {
      return (
        <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Budget exceeded!</span>
        </div>
      );
    }
    if (percentage >= 90) {
      return (
        <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400 text-sm font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Approaching limit</span>
        </div>
      );
    }
    if (percentage >= 75) {
      return (
        <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400 text-sm font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Monitor spending</span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{budget.category.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {budget.category.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monthly Budget
              </p>
            </div>
          </div>
        </div>

        {/* Warning */}
        {getWarningIcon()}

        {/* Amounts */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Budget:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(budget.amount)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Spent:</span>
            <span className="font-semibold text-red-600 dark:text-red-400">
              {formatCurrency(budget.spent || 0)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
            <span className={`font-semibold ${
              (budget.remaining || 0) >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(budget.remaining || 0)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Progress</span>
            <span className="font-semibold">{percentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <button
            onClick={() => onEdit(budget)}
            className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  );
};

export default BudgetCard;
