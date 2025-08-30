import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sequelize from './config/database';
import { errorHandler } from './middleware/errorHandler';
import 'dotenv/config';


const app = express();

// CORS whitelist - read from env so Railway project variables are used in production
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN_1 || 'http://localhost:3000',
  process.env.ALLOWED_ORIGIN_2 || 'https://fullstack-devcase-users-dashboard.vercel.app'
].filter(Boolean);

// TEMPORARY: allow all origins for testing (change back after verification)
// TEMPORARY: allow all origins for testing (change back after verification)
console.log('⚠️ TEMP CORS ENABLED - allowing all origins for testing');
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 1000 }));


app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok' });
});

import authRoutes from './routes/auth';
import userRoutes from './routes/users';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch((err) => console.error('Database connection error:', err));

app.use(errorHandler);

export default app;
