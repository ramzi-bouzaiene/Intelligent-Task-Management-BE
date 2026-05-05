import { pool } from '../../config/database';
import { User } from '../../database/models/user.model';
import { CreateUserDto, UserResponseDto } from './user.dto';

export const getAllUsers = async (): Promise<UserResponseDto[]> => {
  const result = await pool.query('SELECT * FROM users WHERE role != $1', ['developer']);
  return result.rows;
}

export const createUser = async (user: CreateUserDto): Promise<UserResponseDto> => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password, role, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user.name, user.email, user.password, user.role, user.avatar],
  );
  return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<UserResponseDto | null> => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

export const getUserById = async (id: number): Promise<UserResponseDto | null> => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const AddAvatarToUser = async (id: number, avatar: string): Promise<UserResponseDto | null> => {
  const result = await pool.query(
    'UPDATE users SET avatar = $1 WHERE id = $2 RETURNING *',
    [avatar, id],
  );
  return result.rows[0] || null;
}