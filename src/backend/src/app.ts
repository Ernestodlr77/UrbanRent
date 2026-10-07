import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import { requestLogger } from './middlewares/requestLogger.middleware.js';

const app: Application = express();

// Middlewares globales
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Enrutador principal
app.use('/api', routes);

// Middleware de manejo centralizado de errores
app.use(errorHandler);

export default app;