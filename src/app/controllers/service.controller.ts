import config from 'config';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants';

const {
  name,
  version,
  description,
  env,
  startDate,
} = config.get<{
    name: string;
    version: string;
    description: string;
    env: string;
    startDate: string;
}>('app');

export default {
  about(req: Request, res: Response): void {
    res
      .status(HTTP_STATUS_CODES.OK)
      .json({
        name,
        version,
        description,
        env,
        dateNow: new Date().toLocaleString('uk-UA'),
        startDate,
      });
  },
};
