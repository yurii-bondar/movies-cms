import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import authService from '../services/auth.service';
import usersService from '../services/user.service';
import sessionService from '../services/session.service';
import errorLogUtil from '../helpers/errorLog';
import { HTTP_STATUS_CODES } from '../constants';

const errorLog = errorLogUtil(__filename);

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  const {
    email,
    name,
    password,
    confirmPassword,
  } = req.body;

  try {
    if (password !== confirmPassword) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: 'Passwords do not match' });
    }

    const existingUser = await usersService.getUserByEmail(email);
    if (existingUser) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: 'Email already exists' });
    }

    const hashedPassword = await authService.hashPassword(password);
    const user = await usersService.registerUser(email, name, hashedPassword);

    res
      .status(HTTP_STATUS_CODES.CREATED)
      .json({ message: 'User created successfully', user });
  } catch (err) {
    errorLog(`signup(email: ${email}, name: ${name})`, err);
    next(err);
  }
}

async function signin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { email, password } = req.body;

  try {
    const user = await usersService.getUserByEmail(email);
    if (!user) {
      res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: 'User does not exist!' });
    }

    if (user) {
      const isPasswordValid = await authService.comparePassword(password, user.password);
      if (!isPasswordValid) {
        res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ message: 'User does not exist!' });
      }

      const accessToken = authService.generateAccessToken(user);
      const refreshToken = authService.generateRefreshToken(user);

      await sessionService.createSession(user.id, refreshToken);
      await usersService.updateLastSignInDate(user.id);

      res.json({ accessToken, refreshToken });
    }
  } catch (err) {
    errorLog(`signin(${email})`, err);
    next(err);
  }
}

async function renewToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: 'No refresh token provided' });
    }

    const session = await sessionService.getSessionByRefreshToken(refreshToken);
    if (!session || !session.isActive) {
      res
        .status(HTTP_STATUS_CODES.FORBIDDEN)
        .json({ message: 'Invalid or expired refresh token' });
    }

    const payload = authService.verifyRefreshToken(refreshToken);

    if (session) {
      if (session.userId !== (payload as JwtPayload).id) {
        res
          .status(HTTP_STATUS_CODES.FORBIDDEN)
          .json({ message: 'Invalid session' });
      }

      const user = await usersService.getUserById(session.userId);
      if (!user) {
        res
          .status(HTTP_STATUS_CODES.FORBIDDEN)
          .json({ message: 'Invalid user' });
      }

      if (user) {
        const accessToken = authService.generateAccessToken(user);
        res.json({ accessToken });
      }
    }
  } catch (err) {
    errorLog(`renewToken(${req.body.refreshToken})`, err);
    next(err);
  }
}

async function logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    if (req.user) {
      const session = await sessionService.getSessionByUserId(req.user.id);
      if (!session || !session.isActive) {
        res
          .status(HTTP_STATUS_CODES.FORBIDDEN)
          .json({ message: 'Session is already logged out' });
      }

      await sessionService.deactivateSession(req.user.id);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ message: 'Logged out successfully' });
    }
  } catch (err) {
    errorLog(`logout(userId: ${req.user?.id})`, err);
    next(err);
  }
}

export default {
  signup,
  signin,
  renewToken,
  logout,
};
