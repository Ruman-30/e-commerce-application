import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "API documentation for my e-commerce backend",
    },
    servers: [
      {
        url: "http://localhost:3000", // change later when deployed
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // 👈 important
        },
      },
    },
    security: [
      {
        bearerAuth: [], // 👈 apply globally (all routes need JWT unless overridden)
      },
    ],
  },
  apis: ["./src/docs/*.yaml"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
