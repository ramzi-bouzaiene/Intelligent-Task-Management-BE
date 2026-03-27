import fs from "fs";
import path from "path";
import { pool } from "../config/database";

const runMigrations = async () => {
    try {
        console.log("Running migrations...");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                filename TEXT UNIQUE NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const { rows } = await pool.query("SELECT filename FROM migrations");
        const executedMigrations = rows.map((row) => row.filename);

        const migrationsPath = path.join(__dirname, "../migrations");
        const files = fs.readdirSync(migrationsPath).sort();

        for (const file of files) {
            if (executedMigrations.includes(file)) {
                console.log(`Skipping ${file}`);
                continue;
            }

            console.log(`Running ${file}`);

            const filePath = path.join(migrationsPath, file);
            const sql = fs.readFileSync(filePath, "utf-8");

            await pool.query(sql);

            await pool.query(
                "INSERT INTO migrations (filename) VALUES ($1)",
                [file]
            );

            console.log(`${file} executed`);
        }

        console.log("All migrations done");
        process.exit(0);

    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
};

runMigrations();