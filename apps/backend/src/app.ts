import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { env } from './config/env';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import photographerRoutes from './routes/photographerRoutes';
import profileRoutes from './routes/profileRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

const allowedOrigins = new Set([
  ...(env.clientUrls || []),
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://0.0.0.0:3000',
  'http://0.0.0.0:3001',
  'https://shotconnect-20yo.vercel.app' // आपका Vercel लाइव डोमेन
]);

const isAllowedOrigin = (origin: string | undefined) => {
  if (!origin) {
    return true; // Postman, server-to-server या direct tools के लिए
  }

  if (allowedOrigins.has(origin)) {
    return true;
  }

  // सभी *.vercel.app डोमेन्स और लोकल IP को अनुमति दें
  if (origin.endsWith('.vercel.app')) {
    return true;
  }

  try {
    const { hostname } = new URL(origin);
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.')
    );
  } catch {
    return false;
  }
};

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie']
};

// 1. CORS मिडलवेयर लागू करें
app.use(cors(corsOptions));

// 2. Preflight (OPTIONS) रिक्वेस्ट्स को 200 OK के साथ पास करने दें
app.options('*', cors(corsOptions));

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

// ... बाकी का कोड (rateLimit, swagger, routes, errorHandlers) वैसा ही रहेगा