import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { generateProjectDescription } from './ai.controller';
import * as rbacMiddleware from '../../middleware/rbacMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI utility APIs
 */

/**
 * @swagger
 * /api/ai/project-description:
 *   post:
 *     summary: Generate a project description
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateProjectDescriptionRequest'
 *     responses:
 *       200:
 *         description: Project description generated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenerateProjectDescriptionResponse'
 */
router.post('/ai/project-description', authMiddleware, rbacMiddleware.checkPermission('generate_project_description'), generateProjectDescription);

export default router;
