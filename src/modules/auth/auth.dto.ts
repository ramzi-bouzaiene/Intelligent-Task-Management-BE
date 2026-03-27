import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;