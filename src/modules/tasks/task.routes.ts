import { Router } from 'express';
import * as taskController from './task.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import * as rbacMiddleware from '../../middleware/rbacMiddleware';

const route = Router();

/****************************************
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management APIs
 */

/****************************************
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
route.post(
  '/',
  authMiddleware,
  rbacMiddleware.checkPermission('create_task'),
  taskController.createTask,
);

/****************************************
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
route.get(
  '/',
  authMiddleware,
  rbacMiddleware.checkPermission('read_tasks'),
  taskController.getTasks,
);

/****************************************
 * @swagger
 * /api/tasks/kanban:
 *   get:
 *     summary: Get kanban board for all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kanban columns grouped by task status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 columns:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         enum: [pending, in_progress, completed]
 *                       tasks:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Task'
 */
route.get(
  '/kanban',
  authMiddleware,
  rbacMiddleware.checkPermission('read_kanban_tasks'),
  taskController.getKanbanBoard,
);

/****************************************
 * @swagger
 * /api/tasks/kanban/mine:
 *   get:
 *     summary: Get kanban board for the authenticated user's tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kanban columns grouped by task status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 columns:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         enum: [pending, in_progress, completed]
 *                       tasks:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Task'
 */
route.get(
  '/kanban/mine',
  authMiddleware,
  rbacMiddleware.checkPermission('read_kanban_tasks'),
  taskController.getMyKanbanBoard,
);

/****************************************
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Task ID
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
route.delete(
  '/:taskId',
  authMiddleware,
  rbacMiddleware.checkPermission('delete_task'),
  taskController.deleteTask,
);

/****************************************
 * @swagger
 * /api/tasks/{taskId}:
 *   get:
 *     summary: Get task details
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
route.get(
  '/:taskId',
  authMiddleware,
  rbacMiddleware.checkPermission('read_task'),
  taskController.getTaskDetails,
);

/****************************************
 * @swagger
 * /api/tasks/{taskId}/status:
 *   patch:
 *     summary: Change task status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
route.patch(
  '/:taskId/status',
  authMiddleware,
  rbacMiddleware.checkPermission('update_task_status'),
  taskController.changeTaskStatus,
);

/****************************************
 * @swagger
 * /api/tasks/search:
 *   get:
 *     summary: Search tasks by query
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search by task title
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         description: Filter by task status
 *     responses:
 *       200:
 *         description: List of tasks matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
route.get(
  '/search',
  authMiddleware,
  rbacMiddleware.checkPermission('read_tasks'),
  taskController.getTasksByQuery,
);

/****************************************
/**
 * @swagger
 * /api/tasks/users/tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
route.get(
  '/users/tasks',
  authMiddleware,
  rbacMiddleware.checkPermission('read_own_task'),
  taskController.getUserTasks,
);

/****************************************
 * @swagger
 * /api/tasks/projects/{projectId}:
 *   get:
 *     summary: Get all tasks for a specific project
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: List of tasks for the project
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
route.get(
  '/projects/:projectId',
  authMiddleware,
  rbacMiddleware.checkPermission('read_tasks'),
  taskController.getTasksByProjectId,
);

/****************************************
 * @swagger
 * /api/tasks/{taskId}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
route.put(
  '/:taskId',
  authMiddleware,
  rbacMiddleware.checkPermission('update_task'),
  taskController.updateTask,
);

export default route;
