import { Request, Response } from 'express';
import * as taskService from './task.service';
import { createTaskSchema, updateTaskSchema } from './task.dto';

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

export const getKanbanBoard = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);
  const board = await taskService.getKanbanBoardService('all', projectId);
  res.json(board);
};

export const getMyKanbanBoard = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);

  if (!Number.isFinite(projectId)) {
    return res.status(400).json({ error: 'Invalid projectId' });
  }

  const board = await taskService.getKanbanBoardService('mine', projectId);

  return res.json(board);
};

/*export const getTasksByStatus = async (req: Request, res: Response) => {
    const status = req.query.status as typeof taskStatus;
    const tasks = await taskService.getTasksByStatusService(status);
    res.json(tasks);
} */

export const getTasksByProjectId = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);
  const tasks = await taskService.getTasksByProjectIdService(projectId);
  res.json(tasks);
};

export const assignTaskToUser = async (req: Request, res: Response) => {
  const taskId = Number(req.params.taskId);
  const userId = Number(req.params.userId);

  if (!taskId || !userId) {
    return res.status(400).json({ message: 'Invalid taskId or userId' });
  }

  await taskService.assignTaskToUserService(taskId, userId);

  return res.status(200).json({
    success: true,
    message: 'Task assigned successfully',
  });
};