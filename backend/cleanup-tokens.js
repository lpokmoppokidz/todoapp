import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const cleanupTokens = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Clear all refresh tokens from all users
    const result = await User.updateMany(
      {},
      { $set: { refreshTokens: [] } }
    );

    console.log(`✅ Cleaned up refresh tokens for ${result.modifiedCount} users`);
    console.log('All users need to login again');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanupTokens();
