import {
  createTask,
  getTasksByUserId,
  updateTaskStatus,
  deleteTask,
  getTaskById,
  updateTask,
  getAllTasks,
  getTasksByStatus,
  getTasksByUserIdAndStatus,
  getTasksByTitle,
} from './task.repository';
import { CreateTaskDto, UpdateTaskDto, GetTasksQueryDto } from './task.dto';
import { taskStatus } from '../../shared/constants/taskStatus';
import { Task } from '../../database/models/task.model';

export const createNewTask = async (data: CreateTaskDto) => {
  const task = await createTask(data);
  return task;
};

export const getUserTasksService = async (userId: number) => {
  const tasks = await getTasksByUserId(userId);
  return tasks;
};

export const changeTaskStatusService = async (
  taskId: number,
  status: typeof taskStatus.PENDING | typeof taskStatus.IN_PROGRESS | typeof taskStatus.COMPLETED,
) => {
  const task = await updateTaskStatus(taskId, status);
  return task;
};

export const removeTaskService = async (taskId: number) => {
  await deleteTask(taskId);
};

export const getTaskDetailsService = async (taskId: number) => {
  const task = await getTaskById(taskId);
  return task;
};

export const modifyTaskService = async (taskId: number, data: UpdateTaskDto) => {
  const task = await updateTask(taskId, data);
  return task;
};

export const getAllTasksService = async () => {
  const tasks = await getAllTasks();
  return tasks;
};

export const getTasksByStatusService = async (
  status: typeof taskStatus.PENDING | typeof taskStatus.IN_PROGRESS | typeof taskStatus.COMPLETED,
) => {
  const tasks = await getTasksByStatus(status);
  return tasks;
};

export const getTasksByUserIdAndStatusService = async (
  userId: number,
  status: typeof taskStatus.PENDING | typeof taskStatus.IN_PROGRESS | typeof taskStatus.COMPLETED,
) => {
  const tasks = await getTasksByUserIdAndStatus(userId, status);
  return tasks;
};

export const getTasksByTitleService = async (title: string) => {
  const tasks = await getTasksByTitle(title);
  return tasks;
};

export const getTasksByQueryService = async (query: GetTasksQueryDto, userId: number) => {
  if (query.status && query.title) {
    return await getTasksByUserIdAndStatus(userId, query.status);
  }
  if (query.status) {
    return await getTasksByStatusService(query.status);
  }
  if (query.title) {
    return await getTasksByTitleService(query.title);
  }
  return await getUserTasksService(userId);
};

const buildKanbanColumns = (tasks: Task[]) => {
  const columns = [
    { status: taskStatus.PENDING, tasks: [] as Task[] },
    { status: taskStatus.IN_PROGRESS, tasks: [] as Task[] },
    { status: taskStatus.COMPLETED, tasks: [] as Task[] },
  ];

  const columnsByStatus = new Map(columns.map((column) => [column.status, column]));

  for (const task of tasks) {
    const column = columnsByStatus.get(task.status);
    if (column) {
      column.tasks.push(task);
    }
  }

  return { columns };
};

export const getKanbanBoardService = async (scope: 'all' | 'mine', userId: number) => {
  if (scope === 'mine') {
    if (!Number.isFinite(userId)) {
      throw new Error('User ID is required for personal kanban board');
    }
    const tasks = await getTasksByUserId(userId);
    return buildKanbanColumns(tasks);
  }

  const tasks = await getAllTasks();
  return buildKanbanColumns(tasks);
};
