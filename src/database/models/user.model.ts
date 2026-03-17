import { pool } from "../../config/database";

export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at?: Date;
}

// Create user
export const createUser = async (user: User): Promise<User> => {
    const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

    const values = [user.name, user.email, user.password, user.role];

    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const getUsers = async (): Promise<User[]> => {
    const { rows } = await pool.query("SELECT * FROM users ORDER BY id DESC");
    return rows;
};

export const getUserById = async (id: number): Promise<User | null> => {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0] || null;
};

export const deleteUser = async (id: number): Promise<void> => {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
};