import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Web-Shop Dashboard API',
    version: '1.0.0',
    description: 'API for managing product inventory with AI-powered tag suggestions',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local server' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', maxLength: 255 },
          description: { type: 'string', maxLength: 2000 },
          tags: { type: 'array', items: { type: 'string' } },
          price: { type: 'number', minimum: 0 },
          category: { type: 'string', maxLength: 100, nullable: true },
          brand: { type: 'string', maxLength: 100, nullable: true },
          deletedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['name', 'description', 'price'],
      },
      LoginRequest: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['username', 'password'],
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
        required: ['token'],
      },
      TagSuggestionRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['name', 'description'],
      },
      TagSuggestionResponse: {
        type: 'object',
        properties: {
          tags: { type: 'array', items: { type: 'string' } },
        },
        required: ['tags'],
      },
      AuditLog: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          action: { type: 'string' },
          productId: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          details: { type: 'object' },
        },
        required: ['action', 'productId', 'timestamp', 'details'],
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec; 