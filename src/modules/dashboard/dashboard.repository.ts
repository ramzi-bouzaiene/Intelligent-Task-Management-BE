import { pool } from '../../config/database';

export const getTasksThisMonth = async () => {
  const result = await pool.query(
    `SELECT DATE(created_at) AS date,
            COUNT(*)::int AS total_tasks
     FROM tasks
     WHERE created_at >= CURRENT_DATE - INTERVAL '1 month'
     GROUP BY DATE(created_at)
     ORDER BY date`
  );

  return result.rows;
};

export const getTasksLastTenDays = async () => {
  const result = await pool.query(`
    WITH days AS (
      SELECT generate_series(
        CURRENT_DATE - INTERVAL '9 days',
        CURRENT_DATE,
        INTERVAL '1 day'
      )::date AS date
    )
    SELECT
      d.date,
      COALESCE(COUNT(t.id), 0)::int AS total_tasks
    FROM days d
    LEFT JOIN tasks t
      ON DATE(t.created_at) = d.date
    GROUP BY d.date
    ORDER BY d.date
  `);

  return result.rows;
};

export const getProjectMemberEnrolledThisMonth = async () => {
    const result = await pool.query(
        `SELECT COUNT(DISTINCT pm.user_id)::int AS new_members
         FROM project_members pm
         JOIN users u ON u.id = pm.user_id
         WHERE u.created_at >= date_trunc('month', CURRENT_DATE)`
    );

    return result.rows[0];
};

export const getDevelopersEnrolledThisMonth = async () => {
    const result = await pool.query(
        `SELECT COUNT(*)::int AS new_developers
         FROM users
         WHERE role = 'developer'
           AND created_at >= date_trunc('month', CURRENT_DATE)`
    );

    return result.rows[0];
};

export const getProjectThisMonth = async () => {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS new_projects
     FROM projects
     WHERE created_at >= date_trunc('month', CURRENT_DATE)
       AND created_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'`
  );

  return result.rows[0];
};