import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import authService from '../services/auth.service';
import sessionService from '../services/session.service';
import { HTTP_STATUS_CODES } from '../constants';

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export const auth: RequestHandler = async (
  _req: AuthRequest, _res: Response, _next: NextFunction,
) => {
  const authHeader = _req.headers.authorization || '';

  if (!(authHeader && authHeader.startsWith('Bearer '))) {
    _res
      .status(HTTP_STATUS_CODES.UNAUTHORIZED)
      .json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = authService.verifyAccessToken(token) as { id: number; email: string };

    const session = await sessionService.getSessionByUserId(payload.id);
    if (!session || !session.isActive) {
      _res
        .status(HTTP_STATUS_CODES.FORBIDDEN)
        .json({ message: 'Session is no longer active' });
      return;
    }

    Object.assign(_req, { user: payload });
    _next();
  } catch {
    _res
      .status(HTTP_STATUS_CODES.FORBIDDEN)
      .json({ message: 'Forbidden: Invalid token' });
  }
};
