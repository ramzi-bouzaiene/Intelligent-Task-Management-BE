import { pool } from "../../config/database";
import { User } from "../../database/models/user.model";

export const createUser = async (user: User): Promise<User> => {
    const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING $*;
    `;

    const value = [user.name, user.email, user.password, user.role];

    const { rows } = await pool.query(query, value);
    return rows[0];
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const { rows } = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return rows[0] || null;
};