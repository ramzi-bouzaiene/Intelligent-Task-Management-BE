import { pool } from '../../config/database';
import { User } from '../../database/models/user.model';
import { CreateUserDto } from './user.dto';

export const createUser = async (user: CreateUserDto): Promise<User> => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password, role, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user.name, user.email, user.password, user.role, user.avatar],
  );
  return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

export const getUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const AddAvatarToUser = async (id: number, avatar: string): Promise<User | null> => {
  const result = await pool.query(
    'UPDATE users SET avatar = $1 WHERE id = $2 RETURNING *',
    [avatar, id],
  );
  return result.rows[0] || null;
}