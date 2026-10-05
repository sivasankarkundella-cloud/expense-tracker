import dotenv from 'dotenv';
import { connectDB, closeDB } from './config/db.js';
import { seedDatabase } from './seedData.js';

dotenv.config();

const runSeed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await connectDB();
    const result = await seedDatabase();
    console.log(
      `✅ Database seeded successfully with ${result.expenseCount} expenses and ${result.incomeCount} income records!`
    );
    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
