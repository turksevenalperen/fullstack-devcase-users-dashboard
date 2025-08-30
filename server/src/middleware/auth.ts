import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devcase-secret';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader);
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    console.error('Malformed authorization header');
    return res.status(401).json({ message: 'Invalid token' });
  }
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error('Token verify error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}