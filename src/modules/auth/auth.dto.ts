import { z } from 'zod';
import rolesData from '../../config/roles.json';

const allowedRoles = rolesData.roles.map((r: any) => r.name);

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  role: z.string().refine((val) => allowedRoles.includes(val), {
    message: 'Invalid role',
  }),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
