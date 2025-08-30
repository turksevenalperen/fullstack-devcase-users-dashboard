"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateBody = void 0;
const validateBody = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (err) {
        res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
};
exports.validateBody = validateBody;
const validateQuery = (schema) => (req, res, next) => {
    try {
        schema.parse(req.query);
        next();
    }
    catch (err) {
        res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
};
exports.validateQuery = validateQuery;
