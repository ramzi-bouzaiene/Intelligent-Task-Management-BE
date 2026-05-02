import { Request, Response } from 'express';
import * as taskService from './task.service';
import { createTaskSchema, updateTaskSchema } from './task.dto';
import { taskStatus } from '../../shared/constants/taskStatus';

export const createTask = async (req: Request, res: Response) => {
  const data = createTaskSchema.parse(req.body);
  const task = await taskService.createNewTask(data);
  res.status(201).json(task);
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await taskService.getAllTasksService();
  res.json(tasks);
};

export const getUserTasks = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const tasks = await taskService.getUserTasksService(userId);
  res.json(tasks);
};

export const updateTask = async (req: Request, res: Response) => {
  const taskId = Number(req.params.taskId);
  const data = updateTaskSchema.parse(req.body);
  const task = await taskService.modifyTaskService(taskId, data);
  res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = Number(req.params.taskId);
  await taskService.removeTaskService(taskId);
  res.status(204).send();
};

export const getTaskDetails = async (req: Request, res: Response) => {
  const taskId = Number(req.params.taskId);
  const task = await taskService.getTaskDetailsService(taskId);
  res.json(task);
};

export const changeTaskStatus = async (req: Request, res: Response) => {
  const taskId = Number(req.params.taskId);
  const { status } = req.body;
  const task = await taskService.changeTaskStatusService(taskId, status);
  res.json(task);
};

export const getTasksByQuery = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const query = req.query;
  const tasks = await taskService.getTasksByQueryService(query, userId);
  res.json(tasks);
};

/*export const getTasksByStatus = async (req: Request, res: Response) => {
    const status = req.query.status as typeof taskStatus;
    const tasks = await taskService.getTasksByStatusService(status);
    res.json(tasks);
} */
