import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected\n');

    const users = await User.find({}, 'name email refreshTokens');
    
    console.log(`Total users: ${users.length}\n`);
    
    users.forEach(user => {
      console.log(`User: ${user.name} (${user.email})`);
      console.log(`  ID: ${user._id}`);
      console.log(`  Refresh tokens: ${user.refreshTokens.length}`);
      console.log('');
    });

    const usersWithTokens = users.filter(u => u.refreshTokens.length > 0);
    console.log(`Users with active tokens: ${usersWithTokens.length}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkUsers();
