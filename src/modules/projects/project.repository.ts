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

export const addMemberToProject = async (projectId: number, userIds: number[]): Promise<void> => {
   await pool.query(
    `
    INSERT INTO project_members (project_id, user_id)
    SELECT $1, UNNEST($2::int[])
    ON CONFLICT DO NOTHING
    `,
    [projectId, userIds]
  );
};

export const removeMemberFromProject = async (projectId: number, userId: number): Promise<void> => {
  const result = await pool.query(
    `DELETE FROM project_members
     WHERE project_id = $1 AND user_id = $2`,
    [projectId, userId]
  );

  if (result.rowCount === 0) {
    throw new Error('Member not found in project');
  }
};

export const getProjectWithMembers = async (projectId: number) => {
  const result = await pool.query(
    `
    SELECT
      p.id,
      p.name,
      p.description,
      p.created_at,
      p.updated_at,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', u.id,
            'name', u.name
          )
        ) FILTER (WHERE u.id IS NOT NULL),
        '[]'
      ) AS members
    FROM projects p
    LEFT JOIN project_members pm ON pm.project_id = p.id
    LEFT JOIN users u ON u.id = pm.user_id
    WHERE p.id = $1
    GROUP BY p.id
    `,
    [projectId]
  );

  if (result.rowCount === 0) {
    throw new Error('Project not found');
  }

  return result.rows[0];
};

export const getProjectsWithMembersByUser = async (userId: number) => {
  const result = await pool.query(
    `
    SELECT
      p.id,
      p.name,
      p.created_at,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', u.id,
            'name', u.name
          )
        ) FILTER (WHERE u.id IS NOT NULL),
        '[]'
      ) AS members
    FROM projects p
    LEFT JOIN project_members pm ON pm.project_id = p.id
    LEFT JOIN users u ON u.id = pm.user_id
    WHERE p.user_id = $1 OR pm.user_id = $1
    GROUP BY p.id
    `,
    [userId]
  );

  return result.rows;
}