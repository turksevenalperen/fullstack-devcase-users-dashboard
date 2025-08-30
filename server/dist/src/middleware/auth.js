"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'devcase-secret';
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);
    if (!authHeader)
        return res.status(401).json({ message: 'No token provided' });
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        console.error('Malformed authorization header');
        return res.status(401).json({ message: 'Invalid token' });
    }
    const token = parts[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error('Token verify error:', err);
        return res.status(401).json({ message: 'Invalid token' });
    }
}
