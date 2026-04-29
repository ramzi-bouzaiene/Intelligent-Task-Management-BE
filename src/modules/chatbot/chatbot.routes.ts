
import { Router } from "express";
import { handleGenerateAI } from "./chatbot.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/chatbot/ai:
 *   post:
 *     summary: Generate AI response
 *     tags: [Chatbot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateAIRequest'
 *     responses:
 *       200:
 *         description: AI response generated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenerateAIResponse'
 */
router.post("/chatbot/ai", authMiddleware, handleGenerateAI);

export default router;