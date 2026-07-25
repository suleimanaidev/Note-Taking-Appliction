const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/notevault';
  
  try {
    // Attempt connecting to the configured MONGODB_URI with a 3s timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`Local MongoDB connection failed (${err.message}). Falling back to MongoMemoryServer...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected at: ${mongoUri}`);
    } catch (memErr) {
      console.error('Failed to initialize MongoDB Memory Server:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
