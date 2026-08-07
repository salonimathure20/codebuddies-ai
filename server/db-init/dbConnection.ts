import mongoose from "mongoose";
import logger from "../utils/logger";

const createDBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error(`Database connection failed: ${error}`);
    process.exit(1);
  }
};

export default createDBConnection;
