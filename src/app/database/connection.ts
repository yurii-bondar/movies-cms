import { Sequelize } from 'sequelize-typescript';

import {
  User, Session, Dataset, Movie,
} from './entities';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  models: [User, Session, Dataset, Movie],
  logging: false,
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.info('Connected to the database.');

    await sequelize.sync({ alter: false });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
