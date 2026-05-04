import * as userRepo from '../../modules/users/user.repository';
import { User } from '../../database/models/user.model';
import { CreateUserDto } from './user.dto';
import { uploadAvatar } from '../storage/bucket.service';

export const addAvatarToUser = async (id: number, avatar: string): Promise<User | null> => {
  return userRepo.AddAvatarToUser(id, avatar);
};

export const uploadUserAvatar = async (
  id: number,
  file: Express.Multer.File
): Promise<User | null> => {
  const existingUser = await userRepo.getUserById(id);
  if (!existingUser) {
    return null;
  }

  const uploadResult = await uploadAvatar(id, file);
  return userRepo.AddAvatarToUser(id, uploadResult.url);
};

export const createUser = async (dto: CreateUserDto): Promise<User> => {
  return userRepo.createUser(dto);
};