import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(`MongoDB connected with server: ${connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
