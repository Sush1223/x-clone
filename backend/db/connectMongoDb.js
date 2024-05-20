import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongoDb:", conn.connection.host);
  } catch (err) {
    console.log("Error in connecting to mongoDb", err.message);
    process.exit(1);
  }
};

export default connectMongoDb;
