import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { goalService } from '../../services/goalService';
import { Goal } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import GoalCard from './GoalCard';
import GoalFormModal from './GoalFormModal';
import GoalDetailsModal from './GoalDetailsModal';

type FilterStatus = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
type SortBy = 'deadline' | 'progress' | 'amount' | 'date';

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [sortBy, setSortBy] = useState<SortBy>('deadline');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (error) {
      toast.error('Failed to load goals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsFormModalOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormModalOpen(true);
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal? All contributions will be lost.')) return;

    try {
      await goalService.deleteGoal(id);
      toast.success('Goal deleted successfully');
      fetchGoals();
    } catch (error) {
      toast.error('Failed to delete goal');
    }
  };

  const handleAddMoney = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDetailsModalOpen(true);
  };

  const handleViewDetails = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDetailsModalOpen(true);
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setEditingGoal(null);
  };

  const handleFormModalSuccess = () => {
    handleFormModalClose();
    fetchGoals();
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedGoal(null);
  };

  const handleDetailsUpdate = async () => {
    await fetchGoals();
    // Refresh selected goal
    if (selectedGoal) {
      const updatedGoal = await goalService.getGoal(selectedGoal.id);
      setSelectedGoal(updatedGoal);
    }
  };

  // Filter goals
  const filteredGoals = goals.filter((goal) => {
    if (filterStatus === 'ALL') return true;
    return goal.status === filterStatus;
  });

  // Sort goals
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'progress':
        return (b.percentage || 0) - (a.percentage || 0);
      case 'amount':
        return b.targetAmount - a.targetAmount;
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Savings Goals
        </h1>
        <Button onClick={handleAddGoal}>Create New Goal</Button>
      </div>

      {/* Filters and Sort */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filter by Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              <option value="ALL">All Goals</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              <option value="deadline">Deadline (Earliest First)</option>
              <option value="progress">Progress (Highest First)</option>
              <option value="amount">Target Amount (Highest First)</option>
              <option value="date">Date Created (Newest First)</option>
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {goals.filter((g) => g.status === 'ACTIVE').length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {goals.filter((g) => g.status === 'COMPLETED').length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {goals.filter((g) => g.status === 'CANCELLED').length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Cancelled</p>
          </div>
        </div>
      </Card>

      {/* Goals Grid */}
      {sortedGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onAddMoney={handleAddMoney}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {filterStatus === 'ALL' ? 'No savings goals yet' : `No ${filterStatus.toLowerCase()} goals`}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filterStatus === 'ALL'
                ? 'Create your first savings goal to start tracking your progress!'
                : 'Try changing the filter to see other goals.'}
            </p>
            {filterStatus === 'ALL' && (
              <Button onClick={handleAddGoal}>Create Your First Goal</Button>
            )}
          </div>
        </Card>
      )}

      {/* Modals */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={handleFormModalClose}
        onSuccess={handleFormModalSuccess}
        goal={editingGoal}
      />

      <GoalDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleDetailsModalClose}
        goal={selectedGoal}
        onUpdate={handleDetailsUpdate}
      />
    </div>
  );
};

export default Goals;
