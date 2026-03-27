import express from 'express';
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./config/swagger"
import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;