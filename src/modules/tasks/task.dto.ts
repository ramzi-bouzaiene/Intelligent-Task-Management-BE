import { z } from 'zod';
import { taskStatus } from '../../shared/constants/taskStatus';
import { taskSeverity } from '../../shared/constants/taskSeverity';

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z
    .enum([taskStatus.PENDING, taskStatus.IN_PROGRESS, taskStatus.COMPLETED])
    .default(taskStatus.PENDING),
  user_id: z.number().optional(),
  project_id: z.number(),
  severity: z
    .enum([taskSeverity.LOW, taskSeverity.MEDIUM, taskSeverity.HIGH, taskSeverity.URGENT])
    .default(taskSeverity.LOW),
  created_at: z.date().default(() => new Date()),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum([taskStatus.PENDING, taskStatus.IN_PROGRESS, taskStatus.COMPLETED]).optional(),
  project_id: z.number().optional(),
  severity: z
    .enum([taskSeverity.LOW, taskSeverity.MEDIUM, taskSeverity.HIGH, taskSeverity.URGENT])
    .default(taskSeverity.LOW),
  updated_at: z.date().default(() => new Date()),
});

export const getTasksQuerySchema = z.object({
  status: z.enum([taskStatus.PENDING, taskStatus.IN_PROGRESS, taskStatus.COMPLETED]).optional(),
  title: z.string().optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type GetTasksQueryDto = z.infer<typeof getTasksQuerySchema>;
