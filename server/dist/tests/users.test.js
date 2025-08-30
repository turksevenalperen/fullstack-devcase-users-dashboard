"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const database_1 = __importDefault(require("../src/config/database"));
beforeAll(async () => {
    await database_1.default.sync({ force: true });
});
afterAll(async () => {
    await database_1.default.close();
});
describe('Users', () => {
    it('should create a parent and child user and fetch nested', async () => {
        const parent = await (0, supertest_1.default)(app_1.default).post('/api/users').send({
            firstName: 'Parent',
            lastName: 'One',
            email: 'parent@example.com',
            password: 'password123',
        });
        expect(parent.status).toBe(201);
        const parentId = parent.body.id || parent.body.user?.id || parent.body.data?.id;
        const child = await (0, supertest_1.default)(app_1.default).post('/api/users').send({
            firstName: 'Child',
            lastName: 'One',
            email: 'child@example.com',
            password: 'password123',
            parentId,
        });
        expect(child.status).toBe(201);
        const list = await (0, supertest_1.default)(app_1.default).get('/api/users');
        expect(list.status).toBe(200);
        const children = await (0, supertest_1.default)(app_1.default).get('/api/users').query({ parentId });
        expect(children.status).toBe(200);
        expect(Array.isArray(children.body.data)).toBe(true);
    });
});
