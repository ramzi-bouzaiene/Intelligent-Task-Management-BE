import { Pool } from 'pg';
import { User } from '../database/models/user.model';
import { Task } from '../database/models/task.model';
import { taskStatus } from '../shared/constants/taskStatus';
import bcrypt from 'bcrypt';
import { DATABASE_URL } from '../config/env';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM tasks');
    await client.query('DELETE FROM projects');
    await client.query('DELETE FROM users');

    const users: Omit<User, 'id' | 'created_at'>[] = [
      {
        name: 'Alice Smith',
        email: 'alice@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: await bcrypt.hash('securepass', 10),
        role: 'admin',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
    ];

    const insertedUsers: User[] = [];
    for (const user of users) {
      const result = await client.query(
        'INSERT INTO users (name, email, password, role, avatar, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
        [user.name, user.email, user.password, user.role, user.avatar],
      );
      insertedUsers.push(result.rows[0]);
    }

    const projects = [
      {
        name: 'Personal',
        description: 'Personal tasks and reminders',
        user_id: insertedUsers[0].id,
        members: [insertedUsers[0].email],
      },
      {
        name: 'Work',
        description: 'Work-related projects',
        user_id: insertedUsers[1].id,
        members: [insertedUsers[1].email],
      },
    ];

    const insertedProjects = [];
    for (const project of projects) {
      const result = await client.query(
        'INSERT INTO projects (name, description, user_id, members, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
        [project.name, project.description, project.user_id, project.members],
      );
      insertedProjects.push(result.rows[0]);
    }

    const tasks: Omit<Task, 'id' | 'created_at' | 'updated_at'>[] = [
      {
        title: 'Buy groceries',
        description: 'Milk, Bread, Eggs',
        status: 'pending',
        user_id: insertedUsers[0].id,
        project_id: insertedProjects[0].id,
        severity: 'low',
      },
      {
        title: 'Finish project',
        description: 'Complete the final report',
        status: 'in_progress',
        user_id: insertedUsers[1].id,
        project_id: insertedProjects[1].id,
        severity: 'high',
      },
      {
        title: 'Book flight',
        description: 'Book tickets to New York',
        status: 'completed',
        user_id: insertedUsers[0].id,
        project_id: insertedProjects[0].id,
        severity: 'medium',
      },
    ];

    for (const task of tasks) {
      await client.query(
        'INSERT INTO tasks (title, description, status, user_id, project_id, severity, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
        [task.title, task.description, task.status, task.user_id, task.project_id, task.severity],
      );
    }

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

seed();
