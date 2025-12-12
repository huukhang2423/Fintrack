import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { goalService } from '../../services/goalService';
import { Goal, GoalInput } from '../../types';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  goal: Goal | null;
}

const GoalFormModal = ({ isOpen, onClose, onSuccess, goal }: GoalFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalInput>();

  useEffect(() => {
    if (goal) {
      reset({
        name: goal.name,
        description: goal.description || '',
        targetAmount: goal.targetAmount,
        deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
      });
    } else {
      reset({
        name: '',
        description: '',
        targetAmount: 0,
        deadline: '',
      });
    }
  }, [goal, reset]);

  const onSubmit = async (data: GoalInput) => {
    try {
      // Clean up empty deadline
      const submitData = {
        ...data,
        deadline: data.deadline || undefined,
      };

      if (goal) {
        await goalService.updateGoal(goal.id, submitData);
        toast.success('Goal updated successfully');
      } else {
        await goalService.createGoal(submitData);
        toast.success('Goal created successfully');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goal ? 'Edit Goal' : 'Create New Goal'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Goal Name */}
        <Input
          label="Goal Name"
          placeholder="e.g., Emergency Fund, New Laptop, Vacation"
          error={errors.name?.message}
          {...register('name', {
            required: 'Goal name is required',
            minLength: { value: 3, message: 'Name must be at least 3 characters' },
          })}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            placeholder="Describe your savings goal..."
          />
        </div>

        {/* Target Amount */}
        <Input
          label="Target Amount (VND)"
          type="number"
          step="1000"
          error={errors.targetAmount?.message}
          {...register('targetAmount', {
            required: 'Target amount is required',
            min: { value: 1, message: 'Amount must be greater than 0' },
          })}
        />

        {/* Deadline */}
        <Input
          label="Deadline (Optional)"
          type="date"
          error={errors.deadline?.message}
          {...register('deadline')}
        />

        {/* Help Text */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Set a savings goal and track your progress. Add contributions over time to reach your target!
        </p>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {goal ? 'Update Goal' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GoalFormModal;
