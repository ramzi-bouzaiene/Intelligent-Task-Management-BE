import { Router } from 'express';
import * as projectController from './project.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import * as rbacMiddleware from '../../middleware/rbacMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management APIs
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectInput'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
router.post(
  '/',
  authMiddleware,
  rbacMiddleware.checkPermission('create_project'),
  projectController.createProject,
);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get projects (paginated)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *     responses:
 *       200:
 *         description: A paginated list of projects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProjects'
 */
router.get(
  '/',
  authMiddleware,
  rbacMiddleware.checkPermission('read_projects'),
  projectController.getProjects,
);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
router.get(
  '/:id',
  authMiddleware,
  rbacMiddleware.checkPermission('read_project'),
  projectController.getProjectById,
);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProjectInput'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware.checkPermission('update_project'),
  projectController.updateProject,
);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Project deleted successfully
 */
router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware.checkPermission('delete_project'),
  projectController.deleteProject,
);

/**
 * @swagger
 * /api/projects/{id}/members:
 *   post:
 *     summary: Add a member to a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddMemberToProjectInput'
 *     responses:
 *       200:
 *         description: Member added to project successfully
 */
router.post(
  '/:id/members',
  authMiddleware,
  rbacMiddleware.checkPermission('add_member_to_project'),
  projectController.addMemberToProject,
);

/**
 * @swagger
 * /api/projects/{id}/members:
 *   delete:
 *     summary: Remove a member from a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveMemberFromProjectInput'
 *     responses:
 *       200:
 *         description: Member removed from project successfully
 */
router.delete(
  '/:id/members/:userId',
  authMiddleware,
  rbacMiddleware.checkPermission('remove_member_from_project'),
  projectController.removeMemberFromProject,
);

/**
 * @swagger
 * /api/projects/{id}/members:
 *   get:
 *     summary: Get members of a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A list of project members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get(
  '/:id/members',
  authMiddleware,
  rbacMiddleware.checkPermission('read_project_members'),
  projectController.getProjectWithMembers,
);

/**
 * @swagger
 * /api/projects/project-by-members/{memberId}:
 *   get:
 *     summary: Get projects with members by user (paginated)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *     responses:
 *       200:
 *         description: A paginated list of projects with members
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProjectsWithMembers'
 */
router.get(
  '/project-by-members/:memberId',
  authMiddleware,
  rbacMiddleware.checkPermission('read_own_projects'),
  projectController.getProjectsWithMembersByUser
);

export default router;
