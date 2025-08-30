"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const database_1 = __importDefault(require("../src/config/database"));
const globals_1 = require("@jest/globals");
(0, globals_1.beforeAll)(async () => {
    await database_1.default.sync({ force: true });
});
(0, globals_1.afterAll)(async () => {
    await database_1.default.close();
});
(0, globals_1.describe)('Auth', () => {
    (0, globals_1.it)('should register and login a user', async () => {
        const userPayload = {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
        };
        const reg = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(userPayload);
        (0, globals_1.expect)(reg.status).toBe(201);
        (0, globals_1.expect)(reg.body.user).toBeDefined();
        (0, globals_1.expect)(reg.body.user.email).toBe(userPayload.email);
        const login = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({ email: userPayload.email, password: userPayload.password });
        (0, globals_1.expect)(login.status).toBe(200);
        (0, globals_1.expect)(login.body.token).toBeDefined();
        (0, globals_1.expect)(login.body.user).toBeDefined();
    });
});
