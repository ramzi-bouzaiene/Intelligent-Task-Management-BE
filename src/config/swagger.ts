import swaggerJsdoc from "swagger-jsdoc";
import { PORT } from "./env";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express API",
            version: "1.0.0",
            description: "API documentation for your backend",
        },

        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "Development server",
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },

            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        name: { type: "string", example: "Ramzi" },
                        email: { type: "string", example: "ramzi@test.com" },
                        role: { type: "string", example: "user" },
                        created_at: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },

                RegisterInput: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: { type: "string", example: "Ramzi" },
                        email: { type: "string", example: "ramzi@test.com" },
                        password: { type: "string", example: "123456" },
                    },
                },

                LoginInput: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", example: "ramzi@test.com" },
                        password: { type: "string", example: "123456" },
                    },
                },

                AuthResponse: {
                    type: "object",
                    properties: {
                        user: { $ref: "#/components/schemas/User" },
                        token: { type: "string" },
                    },
                },
                Task: {
                    type: "object",
                    required: ["project_id", "title", "status"],
                    properties: {
                        id: { type: "number", example: 1 },
                        project_id: { type: "number", example: 1, description: "ID of the related project" },
                        title: { type: "string", example: "Complete project proposal" },
                        description: { type: "string", example: "Finish the initial draft of the project proposal" },
                        status: { type: "string", example: "pending" },
                        assigned_to: { type: "number", example: 1 },
                        due_date: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                GenerateAIRequest: {
                    type: "object",
                    properties: {
                        prompt: { type: "string", example: "What is the capital of Tunisia?" },
                    },
                },
                GenerateAIResponse: {
                    type: "object",
                    properties: {
                        response: { type: "string", example: "The capital of Tunisia is Tunis." },
                    },
                },
                Project: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        name: { type: "string", example: "Project Alpha" },
                        description: { type: "string", example: "A new project for developing the alpha version" },
                        user_id: { type: "number", example: 1 },
                        created_at: {
                            type: "string",
                            format: "date-time",
                        },
                        updated_at: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                }
            },
        }
    },

    apis: ["./src/modules/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);