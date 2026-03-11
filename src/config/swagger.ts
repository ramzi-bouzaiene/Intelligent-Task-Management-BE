import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'API documentation for Task Management System with AI Chatbot'
        },
        servers: [
            {
                url: "http://localhost:5000/api"
            }
        ]
    },
    apis: ["./src/modules/**/*.ts"]
}

export const swaggerSpec = swaggerJSDoc(options)