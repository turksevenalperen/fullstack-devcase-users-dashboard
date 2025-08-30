import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sequelize from './config/database';
import { errorHandler } from './middleware/errorHandler';
import 'dotenv/config';

const app = express();

console.log('🚀 BACKEND STARTING WITH NEW CORS CONFIG');

// CORS konfigürasyonu - doğru domain'ler
const allowedOrigins = [
  'http://localhost:3000',
  'https://fullstack-devcase-users-dashboard-aheijues1.vercel.app'
];

console.log('✅ Allowed Origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    console.log('📨 Request from origin:', origin);
    
    // Origin yok ise (Postman, server-to-server) izin ver
    if (!origin) {
      console.log('✅ No origin - allowing');
      return callback(null, true);
    }
    
    // İzin verilen origin'ler listesinde var mı kontrol et
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin ALLOWED:', origin);
      return callback(null, true);
    } else {
      console.log('❌ Origin BLOCKED:', origin);
      return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 1000 }));

// Health check endpoint
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    allowedOrigins: allowedOrigins
  });
});

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Database connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected!'))
  .catch((err) => console.error('❌ Database connection error:', err));

app.use(errorHandler);

export default app;