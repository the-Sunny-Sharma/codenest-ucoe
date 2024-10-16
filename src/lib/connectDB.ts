// File: /lib/connectDB.ts
import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI as string);
    isConnected = !!db.connections[0].readyState;
    console.log("New database connection established");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw new Error("Failed to connect to the database");
  }
};
