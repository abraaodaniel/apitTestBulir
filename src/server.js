import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import routes from './routes.js';
import sequelize from './config/database.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Service Booking API',
      version: '1.0.0',
      description: 'API for managing service bookings'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./src/routes.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api', routes);

// Database sync and server start
const PORT = 3004;
// const PORT = process.env.PORT || 3004;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

export default app;