import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sequelize from './config/database';
import { errorHandler } from './middleware/errorHandler';
import 'dotenv/config';

const app = express();

// Başlangıç logu
console.log('🚀 SERVER STARTING - CORS & MIDDLEWARE INITIALIZING');

// Güvenli domain listesini ortam değişkenlerinden al
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN_1,
  process.env.ALLOWED_ORIGIN_2,
].filter(Boolean); // Ortam değişkenlerinden gelen boş veya undefined değerleri filtreler.

console.log('✅ Allowed origins loaded:', allowedOrigins);

// Dinamik CORS kontrolü
app.use(
  cors({
    origin: function (origin, callback) {
      console.log('📨 CORS request origin=', origin);
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Body parser ve güvenlik middleware'leri
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 1000 }));

// Health
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok' });
});

// Route'lar
import authRoutes from './routes/auth';
import userRoutes from './routes/users';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// DB kontrolü
sequelize
  .authenticate()
  .then(() => console.log('Database connected!'))
  .catch((err) => console.error('Database connection error:', err));

// Error handler
app.use(errorHandler);

export default app;
