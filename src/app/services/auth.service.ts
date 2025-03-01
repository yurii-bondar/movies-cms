import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../database/entities';
import config from '../../../config';

const {
  jwt: {
    secret: {
      access: accessSecret,
      refresh: refreshSecret,
    },
    expiresIn: {
      access: accessExpiresIn,
      refresh: refreshExpiresIn,
    },
  },
} = config;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

function generateAccessToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email },
    accessSecret,
    { expiresIn: accessExpiresIn },
  );
}

function generateRefreshToken(user: User): string {
  return jwt.sign(
    { id: user.id },
    refreshSecret,
    { expiresIn: refreshExpiresIn });
}

function verifyAccessToken(token: string): string | JwtPayload {
  return jwt.verify(token, accessSecret);
}

function verifyRefreshToken(token: string): string | JwtPayload {
  return jwt.verify(token, refreshSecret);
}

export default {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
