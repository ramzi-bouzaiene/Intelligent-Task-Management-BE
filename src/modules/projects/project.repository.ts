import { Project } from '../../database/models/project.model';
import { pool } from '../../config/database';

export const createProject = async (project: Project): Promise<Project> => {
  const result = await pool.query(
    'INSERT INTO projects (name, description, user_id, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
    [project.name, project.description, project.user_id],
  );
  return result.rows[0];
};

export const getProjectsByUser = async (userId: number): Promise<Project[]> => {
  const result = await pool.query('SELECT * FROM projects WHERE user_id = $1', [userId]);
  return result.rows;
};

export const getProjectById = async (id: number): Promise<Project | null> => {
  const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const updateProject = async (
  id: number,
  data: Partial<Project>,
): Promise<Project | null> => {
  const result = await pool.query(
    'UPDATE projects SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
    [data.name, data.description, id],
  );
  return result.rows[0] || null;
};

export const deleteProject = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM projects WHERE id = $1', [id]);
};
