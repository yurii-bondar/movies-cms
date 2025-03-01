import pkg from '../package.json';
import { DATASETS_DIR, DEFAULT_APP_PORT } from '../src/app/constants';

export default {
  app: {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    env: process.env.NODE_ENV,
    startDate: new Date().toLocaleString('uk-UA'),
  },
  server: {
    port: process.env.APP_PORT || DEFAULT_APP_PORT,
  },
  datasetsDir: `${process.env.DATASETS_DIR_PATH}/${DATASETS_DIR}`,
  jwt: {
    secret: {
      access: process.env.JWT_ACCESS_SECRET,
      refresh: process.env.JWT_REFRESH_SECRET,
    },
    expiresIn: {
      access: '30m',
      refresh: '7d',
    },
  },
};
