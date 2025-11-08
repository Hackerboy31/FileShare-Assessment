import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { bp_v2 } from './api/v2';

// Load environment variables
dotenv.config();

// Create Express application
const application: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
application.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use(morgan('dev'));

// Health check endpoint
application.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'FileShare API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v2'
  });
});

// Register API blueprints
application.use(bp_v2);

// Error handling middleware (must be last)
application.use(errorHandler);

// 404 handler
application.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    await connectDatabase();
    
    application.listen(PORT, () => {
      console.log(`🚀 FileShare Backend Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api/v2`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Start the server
startServer();

export default application;
