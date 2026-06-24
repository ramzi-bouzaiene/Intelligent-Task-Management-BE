import { pool } from "../../config/database";
import {
  DashboardData,
  TrendDataPoint,
  DayDataPoint,
} from "../../database/models/Dashboard";

interface TaskTrendRow {
  date: string;
  total_tasks: number;
}

interface NewMembersRow {
  new_members: number;
}

interface NewDevRow {
  new_developers: number;
}

interface NewProjectsRow {
  new_projects: number;
}

interface NewTasksRow {
  new_tasks: number;
}

interface TotalProjectsRow {
  total_projects: number;
}

interface TotalMembersRow {
  total_members: number;
}

interface TotalDevelopersRow {
  total_developers: number;
}

interface TotalTasksRow {
  total_tasks: number;
}

export const getDashboardData = async (): Promise<DashboardData> => {
  const [
    tasksThisMonth,
    tasksLastTenDays,

    projectMembersThisMonth,
    developersThisMonth,
    projectsThisMonth,
    newTasksThisMonth,

    totalProjects,
    totalMembers,
    totalDevelopers,
    totalTasks,
  ] = await Promise.all([
    // Tasks trend for the last month
    pool.query<TaskTrendRow>(
      `
      SELECT DATE(created_at) AS date,
             COUNT(*)::int AS total_tasks
      FROM tasks
      WHERE created_at >= CURRENT_DATE - INTERVAL '1 month'
      GROUP BY DATE(created_at)
      ORDER BY date
      `
    ),

    // Tasks trend for the last 10 days
    pool.query<TaskTrendRow>(
      `
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
      `
    ),

    // New members this month
    pool.query<NewMembersRow>(
      `
      SELECT COUNT(DISTINCT pm.user_id)::int AS new_members
      FROM project_members pm
      JOIN users u ON u.id = pm.user_id
      WHERE u.created_at >= date_trunc('month', CURRENT_DATE)
      `
    ),

    // New developers this month
    pool.query<NewDevRow>(
      `
      SELECT COUNT(*)::int AS new_developers
      FROM users
      WHERE role = 'developer'
        AND created_at >= date_trunc('month', CURRENT_DATE)
      `
    ),

    // New projects this month
    pool.query<NewProjectsRow>(
      `
      SELECT COUNT(*)::int AS new_projects
      FROM projects
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
        AND created_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
      `
    ),

    // New tasks this month
    pool.query<NewTasksRow>(
      `
      SELECT COUNT(*)::int AS new_tasks
      FROM tasks
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
        AND created_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
      `
    ),

    // Total projects in platform
    pool.query<TotalProjectsRow>(
      `
      SELECT COUNT(*)::int AS total_projects
      FROM projects
      `
    ),

    // Total members in platform
    pool.query<TotalMembersRow>(
      `
      SELECT COUNT(*)::int AS total_members
      FROM users
      `
    ),

    // Total developers in platform
    pool.query<TotalDevelopersRow>(
      `
      SELECT COUNT(*)::int AS total_developers
      FROM users
      WHERE role = 'developer'
      `
    ),

    // Total tasks in platform
    pool.query<TotalTasksRow>(
      `
      SELECT COUNT(*)::int AS total_tasks
      FROM tasks
      `
    ),
  ]);

  // Monthly counts (for badges)
  const monthlyProjects = projectsThisMonth.rows[0].new_projects;
  const monthlyMembers = projectMembersThisMonth.rows[0].new_members;
  const monthlyDevelopers = developersThisMonth.rows[0].new_developers;
  const monthlyTasks = newTasksThisMonth.rows[0].new_tasks;

  // Platform totals (for main count)
  const allProjects = totalProjects.rows[0].total_projects;
  const allMembers = totalMembers.rows[0].total_members;
  const allDevelopers = totalDevelopers.rows[0].total_developers;
  const allTasks = totalTasks.rows[0].total_tasks;

  return {
    statistics: {
      newProjects: {
        count: allProjects,
        badge: `+${monthlyProjects} this month`,
        change: monthlyProjects,
      },
      newMembers: {
        count: allMembers,
        badge: `+${monthlyMembers} this month`,
        change: monthlyMembers,
      },
      newDevelopers: {
        count: allDevelopers,
        badge: `+${monthlyDevelopers} this month`,
        change: monthlyDevelopers,
      },
      newTasks: {
        count: allTasks,
        badge: `+${monthlyTasks} this month`,
        change: monthlyTasks,
      },
    },

    tasksTrend: {
      period: "30 days",
      data: tasksThisMonth.rows.map<TrendDataPoint>((row) => ({
        date: row.date,
        month: new Date(row.date).toLocaleString("en-US", {
          month: "short",
        }),
        value: row.total_tasks,
      })),
    },

    lastTenDays: {
      period: "10 days",
      data: tasksLastTenDays.rows.map<DayDataPoint>((row) => ({
        date: row.date,
        day: new Date(row.date).toLocaleString("en-US", {
          weekday: "short",
        }),
        value: row.total_tasks,
      })),
    },
  };
};