import bcrypt from 'bcrypt';
import { createUser, getUserByEmail } from './auth.repository';
import { RegisterDto, LoginDto } from './auth.dto';
import { generateToken } from '../../shared/utils/jwt';

export const register = async (data: RegisterDto) => {
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    throw new Error('Email already in use');
  }
  const hashPassword = await bcrypt.hash(data.password, 10);
  const user = await createUser({
    ...data,
    password: hashPassword,
  });
  const token = generateToken(user);
  return { user, token };
};

export const login = async (data: LoginDto) => {
  const user = await getUserByEmail(data.email);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const userExist = await bcrypt.compare(data.password, user.password);

  if (!userExist) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user);

  return { user, token };
};
