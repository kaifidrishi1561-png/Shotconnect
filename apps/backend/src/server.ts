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

    const PORT = Number(process.env.PORT) || env.port || 8000;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`ShotMatch API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();