import { Request, Response } from 'express';
import * as authService from './auth.service';
import { registerSchema, loginSchema } from './auth.dto';

export const register = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  if (!data.role) {
    return res.status(400).json({ error: 'Role is required' });
  }
  const result = await authService.register(data);
  res.status(201).json(result);
};

export const login = async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);

  const result = await authService.login(data);

  res.status(200).json(result);
};
