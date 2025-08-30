import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sequelize from './config/database';
import { errorHandler } from './middleware/errorHandler';
import 'dotenv/config';


const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
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
