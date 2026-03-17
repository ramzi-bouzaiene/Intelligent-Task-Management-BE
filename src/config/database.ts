import mongoose from "mongoose";
import { MONGO_URI } from "./env"
import logger from "./logger";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI)
        logger.info(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        if (error instanceof Error) {
            logger.error("MongoDB connection error:", error.message);
        } else {
            logger.error("MongoDB connection error:", error);
        }
        process.exit(1);
    }
}

export default connectDB