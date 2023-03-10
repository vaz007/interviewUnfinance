import mongoose from "mongoose";
require('dotenv').config();

const connectDB = async () => {
  mongoose.set("strictQuery", false);
  const connection = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   });
  console.log(`MongoDB connected: ${connection.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;