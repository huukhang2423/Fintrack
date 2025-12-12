import { Goal } from '../../types';
import Card from '../../components/ui/Card';
import { differenceInDays } from 'date-fns';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onAddMoney: (goal: Goal) => void;
  onViewDetails: (goal: Goal) => void;
}

const GoalCard = ({ goal, onEdit, onDelete, onAddMoney, onViewDetails }: GoalCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const percentage = goal.percentage || 0;
  const isCompleted = goal.status === 'COMPLETED';
  const isCancelled = goal.status === 'CANCELLED';

  // Progress bar color based on percentage
  const getProgressColor = () => {
    if (isCancelled) return 'bg-gray-400 dark:bg-gray-500';
    if (isCompleted || percentage >= 100) return 'bg-green-600 dark:bg-green-500';
    if (percentage >= 76) return 'bg-yellow-500 dark:bg-yellow-400';
    if (percentage >= 51) return 'bg-green-500 dark:bg-green-400';
    return 'bg-blue-500 dark:bg-blue-400';
  };

  // Deadline warning
  const getDeadlineWarning = () => {
    if (!goal.deadline || isCancelled || isCompleted) return null;

    const daysRemaining = differenceInDays(new Date(goal.deadline), new Date());

    if (daysRemaining < 0) {
      return (
        <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>Overdue by {Math.abs(daysRemaining)} days</span>
        </div>
      );
    } else if (daysRemaining <= 15) {
      return (
        <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>{daysRemaining} days left</span>
        </div>
      );
    } else if (daysRemaining <= 30) {
      return (
        <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400 text-sm font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>{daysRemaining} days left</span>
        </div>
      );
    }
    return null;
  };

  // Status badge
  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
          Completed
        </span>
      );
    }
    if (isCancelled) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
          Cancelled
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
        Active
      </span>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {goal.name}
              </h3>
              {getStatusBadge()}
            </div>
            {goal.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {goal.description}
              </p>
            )}
          </div>
        </div>

        {/* Warning/Deadline */}
        {getDeadlineWarning()}

        {/* Amounts */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Target:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(goal.targetAmount)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Saved:</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {formatCurrency(goal.currentAmount)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
            <span className={`font-semibold ${
              (goal.remaining || 0) <= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {formatCurrency(Math.max(0, goal.remaining || 0))}
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
              className={`h-full transition-all duration-300 ${getProgressColor()} ${
                isCompleted ? 'animate-pulse' : ''
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {!isCancelled && !isCompleted && (
            <button
              onClick={() => onAddMoney(goal)}
              className="px-3 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
            >
              Add Money
            </button>
          )}
          <button
            onClick={() => onViewDetails(goal)}
            className={`px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors ${
              isCancelled || isCompleted ? 'col-span-2' : ''
            }`}
          >
            View Details
          </button>
          <button
            onClick={() => onEdit(goal)}
            className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  );
};

export default GoalCard;
