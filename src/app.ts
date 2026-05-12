import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import taskRoutes from './modules/tasks/task.routes';
import chatbotRoutes from './modules/chatbot/chatbot.routes';
import aiRoutes from './modules/ai/ai.route';
import projectRoutes from './modules/projects/project.routes';
import bucketRoutes from './modules/storage/bucket.routes';
import userRoutes from './modules/users/user.routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);

app.use('/api/tasks', taskRoutes);

app.use('/api', chatbotRoutes);

app.use('/api', aiRoutes);

app.use('/api/projects', projectRoutes);

app.use('/api/users', userRoutes);

app.use('/api/buckets', bucketRoutes);

app.use(errorHandler);

export default app;
