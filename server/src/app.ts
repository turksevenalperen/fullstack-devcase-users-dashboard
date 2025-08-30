import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sequelize from './config/database';
import { errorHandler } from './middleware/errorHandler';
import 'dotenv/config';


const app = express();

// En başa bu log'u ekle
console.log('🚀 SERVER STARTING WITH CORS CONFIG');

const allowedOrigins = [
  'http://localhost:3000',
  'https://fullstack-devcase-users-dashboard-aheijues1.vercel.app'
];

console.log('🔍 Allowed Origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    console.log('📨 CORS Request from origin:', origin);
    
    if (!origin) {
      console.log('✅ No origin (probably same-origin), allowing');
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin ALLOWED:', origin);
      return callback(null, true);
    } else {
      console.log('❌ Origin BLOCKED:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));