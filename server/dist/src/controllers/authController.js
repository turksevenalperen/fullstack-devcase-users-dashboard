"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = exports.getMe = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const getMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const user = await User_1.default.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch user', error: err });
    }
};
exports.getMe = getMe;
const JWT_SECRET = process.env.JWT_SECRET || 'devcase-secret';
const register = async (req, res) => {
    console.log("REGISTER BODY:", req.body);
    try {
        const { email, password, firstName, lastName, role } = req.body;
        const existingUser = await User_1.default.findOne({ where: { email } });
        if (existingUser)
            return res.status(409).json({ message: 'Email already exists' });
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = await User_1.default.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: role || 'user',
            status: (role === 'admin') ? 'active' : 'pending',
        });
        res.status(201).json({ user });
    }
    catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ where: { email } });
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
        res.json({ token, user });
    }
    catch (err) {
        res.status(500).json({ message: 'Login failed', error: err });
    }
};
exports.login = login;
