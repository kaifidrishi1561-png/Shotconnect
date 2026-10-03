import mongoose from 'mongoose';
import app from './app';
import { env } from './config/env';
import { seedDatabase } from './services/seedService';

const startServer = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('Connected to MongoDB');

    await seedDatabase();
    console.log('Database seed check complete');

    app.listen(env.port, () => {
      console.log(`ShotMatch API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
