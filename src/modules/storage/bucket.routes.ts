import express, { Request, Response } from "express";
import { createBucket } from "./bucket.service";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

interface CreateBucketBody {
  bucketName?: string;
}

/**
 * @swagger
 * tags:
 *   name: Buckets
 *   description: Bucket management APIs
 */

/**
 * @swagger
 * /api/buckets:
 *   post:
 *     summary: Create a new bucket
 *     tags: [Buckets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bucket'
 *     responses:
 *       201:
 *         description: The created bucket
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bucket'
 */
router.post(
  "/",
  async (req: Request<{}, {}, CreateBucketBody>, res: Response) => {
    try {
      const { bucketName } = req.body;

      if (!bucketName) {
        return res.status(400).json({
          message: "bucketName is required",
        });
      }

      const result = await createBucket(bucketName);

      return res.status(200).json(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error";

      console.error(err);

      return res.status(500).json({
        message: "Failed to create bucket",
        error: message,
      });
    }
  }, authMiddleware
);

export default router;