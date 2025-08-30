import 'dotenv/config';
import { Sequelize } from 'sequelize';


let sequelize: Sequelize;
if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize('sqlite::memory:', { dialect: 'sqlite', logging: false });
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
    logging: false,
  });
}

export default sequelize;