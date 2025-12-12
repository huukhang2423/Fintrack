import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { goalService } from '../../services/goalService';
import { Goal, ContributionInput } from '../../types';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface GoalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onUpdate: () => void;
}

const GoalDetailsModal = ({ isOpen, onClose, goal, onUpdate }: GoalDetailsModalProps) => {
  const [isAddingContribution, setIsAddingContribution] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContributionInput>();

  if (!goal) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const onSubmitContribution = async (data: ContributionInput) => {
    try {
      await goalService.addContribution(goal.id, data);
      toast.success('Contribution added successfully');
      reset();
      setIsAddingContribution(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add contribution');
    }
  };

  const handleRemoveContribution = async (contributionId: string) => {
    if (!confirm('Are you sure you want to remove this contribution?')) return;

    try {
      await goalService.removeContribution(goal.id, contributionId);
      toast.success('Contribution removed successfully');
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to remove contribution');
    }
  };

  const handleStatusChange = async (status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED') => {
    if (!confirm(`Are you sure you want to mark this goal as ${status.toLowerCase()}?`)) return;

    try {
      await goalService.updateGoalStatus(goal.id, status);
      toast.success(`Goal marked as ${status.toLowerCase()}`);
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    }
  };

  const percentage = goal.percentage || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={goal.name}>
      <div className="space-y-6">
        {/* Goal Info */}
        <div className="space-y-3">
          {goal.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Target:</span>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(goal.targetAmount)}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Saved:</span>
              <p className="font-semibold text-blue-600 dark:text-blue-400">
                {formatCurrency(goal.currentAmount)}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(Math.max(0, goal.remaining || 0))}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Progress:</span>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {percentage.toFixed(0)}%
              </p>
            </div>
            {goal.deadline && (
              <div className="col-span-2">
                <span className="text-gray-600 dark:text-gray-400">Deadline:</span>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {format(new Date(goal.deadline), 'MMMM dd, yyyy')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status Actions */}
        {goal.status === 'ACTIVE' && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange('COMPLETED')}
              className="flex-1 px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              Mark Complete
            </button>
            <button
              onClick={() => handleStatusChange('CANCELLED')}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel Goal
            </button>
          </div>
        )}

        {goal.status !== 'ACTIVE' && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange('ACTIVE')}
              className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              Reactivate Goal
            </button>
          </div>
        )}

        {/* Add Contribution Section */}
        {goal.status === 'ACTIVE' && !isAddingContribution && (
          <Button onClick={() => setIsAddingContribution(true)} className="w-full">
            Add Contribution
          </Button>
        )}

        {isAddingContribution && (
          <form onSubmit={handleSubmit(onSubmitContribution)} className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Input
              label="Amount (VND)"
              type="number"
              step="1000"
              error={errors.amount?.message}
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 1, message: 'Amount must be greater than 0' },
              })}
            />
            <Input
              label="Date (Optional)"
              type="date"
              {...register('date')}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Note (Optional)
              </label>
              <input
                type="text"
                {...register('note')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                placeholder="e.g., Monthly savings"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsAddingContribution(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Add
              </Button>
            </div>
          </form>
        )}

        {/* Contribution History */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Contribution History ({goal.contributions.length})
          </h4>
          {goal.contributions.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {goal.contributions.map((contribution) => (
                <div
                  key={contribution.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(Number(contribution.amount))}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(contribution.date), 'MMM dd, yyyy')}
                    </p>
                    {contribution.note && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                        {contribution.note}
                      </p>
                    )}
                  </div>
                  {goal.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleRemoveContribution(contribution.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
              No contributions yet
            </p>
          )}
        </div>

        {/* Close Button */}
        <Button onClick={onClose} variant="secondary" className="w-full">
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default GoalDetailsModal;
