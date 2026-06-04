import { pool } from '../../config/database';
import {
  DashboardData,
  TrendDataPoint,
  DayDataPoint,
} from "../../database/models/Dashboard";

interface TaskTrendRow { date: string; total_tasks: number; }
interface NewMembersRow { new_members: number; }
interface NewDevRow { new_developers: number; }
interface NewProjectsRow { new_projects: number; }
interface NewTasksRow { new_tasks: number; }

export const getDashboardData = async (): Promise<DashboardData> => {
  const [
    tasksThisMonth,
    tasksLastTenDays,
    projectMembersThisMonth,
    developersThisMonth,
    projectsThisMonth,
    newTasksThisMonth,
  ] = await Promise.all([

    pool.query<TaskTrendRow>(
      `SELECT DATE(created_at) AS date,
                COUNT(*)::int    AS total_tasks
         FROM tasks
         WHERE created_at >= CURRENT_DATE - INTERVAL '1 month'
         GROUP BY DATE(created_at)
         ORDER BY date`
    ),

    pool.query<TaskTrendRow>(`
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
        LEFT JOIN tasks t ON DATE(t.created_at) = d.date
        GROUP BY d.date
        ORDER BY d.date
      `),

    pool.query<NewMembersRow>(
      `SELECT COUNT(DISTINCT pm.user_id)::int AS new_members
         FROM project_members pm
         JOIN users u ON u.id = pm.user_id
         WHERE u.created_at >= date_trunc('month', CURRENT_DATE)`
    ),

    pool.query<NewDevRow>(
      `SELECT COUNT(*)::int AS new_developers
         FROM users
         WHERE role = 'developer'
           AND created_at >= date_trunc('month', CURRENT_DATE)`
    ),

    pool.query<NewProjectsRow>(
      `SELECT COUNT(*)::int AS new_projects
         FROM projects
         WHERE created_at >= date_trunc('month', CURRENT_DATE)
           AND created_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'`
    ),

    pool.query<NewTasksRow>(
      `SELECT COUNT(*)::int AS new_tasks
         FROM tasks
         WHERE created_at >= date_trunc('month', CURRENT_DATE)
           AND created_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'`
    ),
  ]);

  const newProjects = projectsThisMonth.rows[0].new_projects;
  const newMembers = projectMembersThisMonth.rows[0].new_members;
  const newDevelopers = developersThisMonth.rows[0].new_developers;
  const newTasks = newTasksThisMonth.rows[0].new_tasks;

  return {
    statistics: {
      newProjects: {
        count: newProjects,
        badge: `+${newProjects} this month`,
        change: newProjects,
      },
      newMembers: {
        count: newMembers,
        badge: `+${newMembers} this month`,
        change: newMembers,
      },
      newDevelopers: {
        count: newDevelopers,
        badge: `+${newDevelopers} this month`,
        change: newDevelopers,
      },
      newTasks: {
        count: newTasks,
        badge: `+${newTasks} this month`,
        change: newTasks,
      },
    },

    tasksTrend: {
      period: "30 days",
      data: tasksThisMonth.rows.map<TrendDataPoint>((row) => ({
        date: row.date,
        month: new Date(row.date).toLocaleString("en-US", { month: "short" }),
        value: row.total_tasks,
      })),
    },

    lastTenDays: {
      period: "10 days",
      data: tasksLastTenDays.rows.map<DayDataPoint>((row) => ({
        date: row.date,
        day: new Date(row.date).toLocaleString("en-US", { weekday: "short" }),
        value: row.total_tasks,
      })),
    },
  };
}