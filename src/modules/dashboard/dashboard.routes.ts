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
 * /api/dashboard/data:
 *   get:
 *     summary: Get dashboard data
 *     description: Retrieve aggregated data for the dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardData'
 *       500:
 *         description: Internal server error
 */
router.get('/data', authMiddleware, rbacMiddleware.checkPermission('view_dashboard'), dashboardController.getDashboardData);

export default router;