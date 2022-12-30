// const mongoose = require("mongoose");
// const config = require("config");
// const db = config.get("mongoURI");
import mongoose from "mongoose";
import config from "config";
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(db);
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err);
    //Exit process with 1
    process.exit(1);
  }
};

// module.exports = connectDB;
export default connectDB;
