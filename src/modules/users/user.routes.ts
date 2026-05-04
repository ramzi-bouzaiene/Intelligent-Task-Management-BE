import { Router } from 'express';
import multer from 'multer';
import * as userController from './user.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { checkPermission } from '../../middleware/rbacMiddleware';

const router = Router();

const allowedAvatarTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
]);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!allowedAvatarTypes.has(file.mimetype)) {
            return cb(new Error('Unsupported avatar type'));
        }

        cb(null, true);
    },
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/', checkPermission('add_user'), authMiddleware, userController.createUser);

/**
 * @swagger
 * /api/users/{id}/avatar:
 *   post:
 *     summary: Add an avatar to a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 description: The avatar URL
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/:id/avatar', checkPermission('add_avatar'), authMiddleware, upload.single('avatar'), userController.addAvatarToUser);

export default router;