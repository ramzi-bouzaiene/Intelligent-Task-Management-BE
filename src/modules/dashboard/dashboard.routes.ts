import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import * as rbacMiddleware from '../../middleware/rbacMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard APIs
 */

/**
 * @swagger
 * /api/dashboard/tasks-this-month:
 *   get:
 *     summary: Get tasks for this month
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get(
    '/tasks-this-month',
    authMiddleware,
    rbacMiddleware.checkPermission('view_dashboard'),
    dashboardController.getTasksThisMonth,
);

/**
 * @swagger
 * /api/dashboard/tasks-last-ten-days:
 *   get:
 *     summary: Get tasks for the last ten days
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get(
    '/tasks-last-ten-days',
    authMiddleware,
    rbacMiddleware.checkPermission('view_dashboard'),
    dashboardController.getTasksLastTenDays,
);

/**
 * @swagger
 * /api/dashboard/project-members-this-month:
 *   get:
 *     summary: Get project members enrolled for this month
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of project members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectMember'
 */
router.get(
    '/project-members-this-month',
    authMiddleware,
    rbacMiddleware.checkPermission('view_dashboard'),
    dashboardController.getProjectMemberEnrolledThisMonth,
);

/**
 * @swagger
 * /api/dashboard/developers-this-month:
 *   get:
 *     summary: Get developers enrolled for this month
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of developers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Developer'
 */
router.get(
    '/developers-this-month',
    authMiddleware,
    rbacMiddleware.checkPermission('view_dashboard'),
    dashboardController.getDevelopersEnrolledThisMonth,
);

/**
 * @swagger
 * /api/dashboard/projects-this-month:
 *   get:
 *     summary: Get projects for this month
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get(
    '/projects-this-month',
    authMiddleware,
    rbacMiddleware.checkPermission('view_dashboard'),
    dashboardController.getProjectThisMonth,
);

export default router;