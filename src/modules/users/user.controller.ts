import { Request, Response } from 'express';
import * as userService from './user.service';

export const createUser = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
};

export const addAvatarToUser = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (!Number.isFinite(userId)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  if (req.file) {
    const user = await userService.uploadUserAvatar(userId, req.file);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  }

  const avatar = req.body.avatar;
  if (typeof avatar !== 'string' || avatar.trim() === '') {
    return res.status(400).json({ message: 'Avatar file is required' });
  }

  const user = await userService.addAvatarToUser(userId, avatar.trim());
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};