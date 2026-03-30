import { Router } from "express";
import * as taskController from "./task.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
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
 *  post:
 *   summary: Create a new task
 *  tags: [Tasks]
 *  security:
 *  - bearerAuth: []
 * requestBody:
 * required: true
 *  content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/CreateTaskInput'
 * responses:
 * 201:
 * description: Task created successfully
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Task'
 */
route.post("/", authMiddleware, taskController.createTask);

/****************************************
 * @swagger
 * /api/tasks:
 *  get:
 *  summary: Get all tasks for the authenticated user
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: List of tasks
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Task'
 */
route.get("/", authMiddleware, taskController.getTasks);

/****************************************
 * @swagger
 * /api/tasks/{id}:
 * patch:
 * summary: Update task status
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: Task ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * status:
 * type: string
 * enum: [pending, in_progress, completed]
 * responses:
 * 200:
 * description: Task updated successfully
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Task'
 * 404:
 * description: Task not found

route.patch("/:id", authMiddleware, taskController.updateTaskStatus);*/

/****************************************
 * @swagger
 * /api/tasks/{id}:
 * delete:
 * summary: Delete a task
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: Task ID
 * responses:
 * 204:
 * description: Task deleted successfully
 * 404:
 * description: Task not found
 */
route.delete("/:id", authMiddleware, taskController.deleteTask);

/****************************************
 * @swagger
 * /api/tasks/{id}:
 * get:
 * summary: Get task details
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: Task ID
 * responses:
 * 200:
 * description: Task details
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Task'
 * 404:
 * description: Task not found
 */
route.get("/:id", authMiddleware, taskController.getTaskDetails);

/****************************************
 * @swagger
 * /api/tasks/{id}/status:
 * patch:
 * summary: Change task status
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: Task ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * status:
 * type: string
 * enum: [pending, in_progress, completed]
 * responses:
 * 200:
 * description: Task status updated successfully
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Task'
 * 404:
 * description: Task not found
 */
route.patch("/:id/status", authMiddleware, taskController.changeTaskStatus);

/****************************************
 * @swagger
 * /api/tasks/search:
 * get:
 * summary: Search tasks by query
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: title
 * schema:
 * type: string
 * description: Search by task title
 * - in: query
 * name: status
 * schema:
 * type: string
 * enum: [pending, in_progress, completed]
 * description: Filter by task status
 * responses:
 * 200:
 * description: List of tasks matching the query
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Task'
 */
route.get("/search", authMiddleware, taskController.getTasksByQuery);

/****************************************
 * @swagger
 * /api/tasks/status:
 * get:
 * summary: Get tasks by status
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: status
 * schema:
 * type: string
 * enum: [pending, in_progress, completed]
 * description: Filter tasks by status
 * responses:
 * 200:
 * description: List of tasks with the specified status
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Task'

route.get("/status", authMiddleware, taskController.getTasksByStatus);*/

export default route;