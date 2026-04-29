import { pool } from "../../config/database";

export const saveAIInteraction = async (prompt: string, response: string) => {
    const query = `
        INSERT INTO ai_logs (prompt, response)
        VALUES ($1, $2)
    `;

    await pool.query(query, [prompt, response]);
};