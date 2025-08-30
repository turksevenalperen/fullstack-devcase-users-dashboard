"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersQuerySchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2),
    lastName: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['admin', 'manager', 'user']).optional(),
    parentId: zod_1.z.string().optional(),
});
exports.updateUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2).optional(),
    lastName: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).optional(),
    role: zod_1.z.enum(['admin', 'manager', 'user']).optional(),
    status: zod_1.z.enum(['active', 'inactive', 'pending']).optional(),
    parentId: zod_1.z.string().optional(),
});
exports.listUsersQuerySchema = zod_1.z.object({
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
    sort: zod_1.z.string().optional(),
    order: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    role: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    parentId: zod_1.z.string().optional(),
});
