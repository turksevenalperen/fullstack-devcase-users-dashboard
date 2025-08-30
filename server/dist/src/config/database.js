"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const sequelize_1 = require("sequelize");
let sequelize;
if (process.env.NODE_ENV === 'test') {
    sequelize = new sequelize_1.Sequelize('sqlite::memory:', { dialect: 'sqlite', logging: false });
}
else {
    sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
    });
}
exports.default = sequelize;
