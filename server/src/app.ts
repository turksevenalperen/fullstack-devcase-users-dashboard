import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sequelize from './config/database';
import { errorHandler } from './middleware/errorHandler';
import 'dotenv/config';


const app = express();
app.use(express.json());
const allowedOrigins = [
  'http://localhost:3000',
  'https://fullstack-devcase-users-dashboard.vercel.app'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
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
