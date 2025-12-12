import { Router } from 'express';
import {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  addContribution,
  removeContribution,
  updateGoalStatus,
} from '../controllers/goalController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Goal CRUD routes
router.get('/', getGoals);
router.get('/:id', getGoal);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

// Contribution routes
router.post('/:id/contributions', addContribution);
router.delete('/:id/contributions/:contributionId', removeContribution);

// Status update route
router.patch('/:id/status', updateGoalStatus);

export default router;
