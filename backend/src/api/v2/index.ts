import { Router } from 'express';
import { initializeRoutes } from './route';

export const API_URL_PREFIX = '/api/v2';

// Create Express router for v2 API
export const bp_v2 = Router();

// Initialize all routes
initializeRoutes(bp_v2);
