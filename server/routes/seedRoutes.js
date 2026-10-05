import express from 'express';
import { seedDatabase } from '../seedData.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const result = await seedDatabase();
    res.status(200).json({
      success: true,
      message: `Database successfully seeded with ${result.expenseCount} expenses and ${result.incomeCount} income records!`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
