import { pool } from "../../config/database";
import { Task } from "../../database/models/task.model";
import { taskStatus } from "../../shared/constants/taskStatus";

export const createTask = async (task: Task): Promise<Task> => {
    const query = `
    INSERT INTO tasks (title, description, status, user_id, project_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `;
    const values = [task.title, task.description, task.status, task.user_id, task.project_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const getTasksByUserId = async (userId: number): Promise<Task[]> => {
     const result = await pool.query(
        'SELECT * FROM tasks WHERE user_id = $1',
        [userId]
    );
    return result.rows;
}

export const updateTaskStatus = async (taskId: number, status: typeof taskStatus.PENDING | typeof taskStatus.IN_PROGRESS | typeof taskStatus.COMPLETED): Promise<Task> => {
    const query = `
    UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2
    RETURNING *;
    `;
    const result = await pool.query(query, [status, taskId]);
    return result.rows[0];
}

export const deleteTask = async (taskId: number): Promise<void> => {
    const query = `
    DELETE FROM tasks WHERE id = $1;
    `;
    await pool.query(query, [taskId]);
}

export const getTaskById = async (taskId: number): Promise<Task | null> => {
    const query = `
    SELECT * FROM tasks WHERE id = $1;
    `;
    const result = await pool.query(query, [taskId]);
    return result.rows[0] || null;
}

export const updateTask = async (taskId: number, task: Partial<Task>): Promise<Task> => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(task)) {
        if (value !== undefined) {
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }
    }

    if (fields.length === 0) {
        throw new Error("No valid fields to update");
    }

    values.push(taskId);

    const query = `
        UPDATE tasks
        SET ${fields.join(", ")}
        WHERE id = $${index}
        RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
}

export const getAllTasks = async (): Promise<Task[]> => {
    const query = `
    SELECT * FROM tasks;
    `;
    const result = await pool.query(query);
    return result.rows;
}

export const getTasksByStatus = async (status: typeof taskStatus.PENDING | typeof taskStatus.IN_PROGRESS | typeof taskStatus.COMPLETED): Promise<Task[]> => {
    const query = `
    SELECT * FROM tasks WHERE status = $1;
    `;
    const result = await pool.query(query, [status]);
    return result.rows;
}

export const getTasksByUserIdAndStatus = async (userId: number, status: typeof taskStatus.PENDING | typeof taskStatus.IN_PROGRESS | typeof taskStatus.COMPLETED): Promise<Task[]> => {
    const query = `
    SELECT * FROM tasks WHERE user_id = $1 AND status = $2;
    `;
    const result = await pool.query(query, [userId, status]);
    return result.rows;
}

export const getTasksByTitle = async (title: string): Promise<Task[]> => {
    const query = `
    SELECT * FROM tasks WHERE title ILIKE $1;
    `;
    const result = await pool.query(query, [`%${title}%`]);
    return result.rows;
}