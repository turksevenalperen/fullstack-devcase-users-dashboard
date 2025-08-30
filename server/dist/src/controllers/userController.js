"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const sequelize_1 = require("sequelize");
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = '', role, status } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let where = {};
        if (search && String(search).trim() !== "") {
            where = {
                [sequelize_1.Op.or]: [
                    { firstName: { [sequelize_1.Op.iLike]: `%${String(search).trim()}%` } },
                    { lastName: { [sequelize_1.Op.iLike]: `%${String(search).trim()}%` } },
                    { email: { [sequelize_1.Op.iLike]: `%${String(search).trim()}%` } },
                ]
            };
            console.log('Arama where:', where);
        }
        if (role)
            where.role = role;
        if (status)
            where.status = status;
        if (req.query.parentId) {
            where.parentId = String(req.query.parentId);
        }
        else {
            where.parentId = null;
        }
        const { rows, count } = await User_1.default.findAndCountAll({
            where,
            order: [[String(sort), String(order)]],
            offset,
            limit: Number(limit),
            include: [{ model: User_1.default, as: 'children' }],
        });
        res.json({
            data: rows,
            meta: {
                total: count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(count / Number(limit)),
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const user = await User_1.default.findByPk(req.params.id, {
            include: [{ model: User_1.default, as: 'children' }],
        });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch user', error: err });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const user = await User_1.default.create(req.body);
        const created = await User_1.default.findByPk(user.id, { include: [{ model: User_1.default, as: 'children' }] });
        res.status(201).json(created);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to create user', error: err });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const user = await User_1.default.findByPk(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        await user.update(req.body);
        const updated = await User_1.default.findByPk(user.id, { include: [{ model: User_1.default, as: 'children' }] });
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to update user', error: err });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const user = await User_1.default.findByPk(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        await user.destroy();
        res.json({ message: 'User deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to delete user', error: err });
    }
};
exports.deleteUser = deleteUser;
