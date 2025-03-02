import path from 'path';
import express, { Express } from 'express';
import config from '../../config';

import routes from './routes';
import { connectDB } from './database/connection';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { DATASETS_DIR } from './constants';

const { server: { port }, datasetsDir } = config;

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(`/${DATASETS_DIR}`, express.static(path.resolve(__dirname, datasetsDir)));
app.use(routes);
app.use(errorHandler);

(async () => {
  try {
    await connectDB();
    app.listen(port, () => console.info('🚀 Server has been successfully launched'));
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
})();
