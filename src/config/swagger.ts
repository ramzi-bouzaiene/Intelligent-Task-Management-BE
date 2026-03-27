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
                url: `http://localhost:${PORT}/api/v1`,
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
            },
        },

        security: [
            {
                bearerAuth: [],
            },
        ],
    },

    apis: ["./src/modules/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);