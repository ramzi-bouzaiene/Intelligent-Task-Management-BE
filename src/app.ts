import express from 'express';
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./config/swagger"

const app = express();

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default app;