"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const database_1 = __importDefault(require("./config/database"));
const errorHandler_1 = require("./middleware/errorHandler");
require("dotenv/config");
const app = (0, express_1.default)();
// CORS whitelist - read from env so Railway project variables are used in production
const allowedOrigins = [
    process.env.ALLOWED_ORIGIN_1 || 'http://localhost:3000',
    process.env.ALLOWED_ORIGIN_2 || 'https://fullstack-devcase-users-dashboard.vercel.app'
].filter(Boolean);
// TEMPORARY: allow all origins for testing (change back after verification)
// TEMPORARY: allow all origins for testing (change back after verification)
console.log('⚠️ TEMP CORS ENABLED - allowing all origins for testing');
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, express_rate_limit_1.default)({ windowMs: 1 * 60 * 1000, max: 1000 }));
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
database_1.default.authenticate()
    .then(() => console.log('Database connected!'))
    .catch((err) => console.error('Database connection error:', err));
app.use(errorHandler_1.errorHandler);
exports.default = app;
