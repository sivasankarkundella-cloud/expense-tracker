import express from 'express';
import {
  getAllIncome,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
} from '../controllers/incomeController.js';

const router = express.Router();

router.route('/').get(getAllIncome).post(createIncome);
router
  .route('/:id')
  .get(getIncomeById)
  .put(updateIncome)
  .delete(deleteIncome);

export default router;
