import { Pool } from "pg";
import logger from "./logger";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
});

const connectDB = async (retries = 5): Promise<void> => {
    try {
        const client = await pool.connect();
        logger.info("PostgreSQL connected");

        client.release();
    } catch (error: any) {
        logger.error(`PostgreSQL error: ${error.message}`);

        if (retries > 0) {
            logger.warn(`Retrying DB connection... (${retries} left)`);
            setTimeout(() => connectDB(retries - 1), 5000);
        } else {
            logger.error("Failed to connect to PostgreSQL after retries");
            process.exit(1);
        }
    }
};

export { pool, connectDB };