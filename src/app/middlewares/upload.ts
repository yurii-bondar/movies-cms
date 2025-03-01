import { Request } from 'express';
import multer from 'multer';
import path from 'path';

import {
  DATASETS_DIR,
  MAX_FILE_SIZE,
  ALLOWED_FILES_EXTENSIONS,
  MAX_NUMBER_OF_FILES_PER_REQUEST,
} from '../constants';

interface RequestWithUser extends Request {
  user?: {
    id: string | number;
  };
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${DATASETS_DIR}/`);
  },
  filename: (req, file, cb) => {
    const userId = (req as RequestWithUser).user?.id;
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14);
    cb(null, `${userId}_${timestamp}_${file.originalname}`);
  },
});

const fileFilter = (req: unknown, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!ALLOWED_FILES_EXTENSIONS.includes(path.extname(file.originalname))) {
    return cb(new Error('Not allowed file extension!'));
  }
  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

export default {
  single: upload.single('file'),
  multi: upload.array('files'),
  multiLimited: upload.array('files', MAX_NUMBER_OF_FILES_PER_REQUEST),
};
