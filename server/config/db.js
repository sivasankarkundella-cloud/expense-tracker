import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expenseflow';

  try {
    // Attempt standard connection with 2.5s server selection timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`⚠️ Could not connect to external MongoDB at ${uri}: ${err.message}`);
    console.log('⚡ Initializing Embedded In-Memory MongoDB for seamless execution...');

    try {
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`🚀 In-Memory MongoDB Connected at: ${memUri}`);
    } catch (memErr) {
      console.error('❌ Failed to connect to In-Memory MongoDB:', memErr);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
