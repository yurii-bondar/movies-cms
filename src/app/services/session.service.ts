import { Session } from '../database/entities';
import sessionRepo from '../repositories/session.repository';

async function createSession(userId: number, refreshToken: string): Promise<void> {
  return sessionRepo.setUserSession(userId, refreshToken);
}

async function deactivateSession(userId: number): Promise<void> {
  return sessionRepo.setLogoutDate(userId);
}

async function getSessionByRefreshToken(refreshToken: string): Promise<Session | null> {
  return sessionRepo.getSessionByRefreshToken(refreshToken);
}

async function getSessionByUserId(userId: number): Promise<{
  id: number,
  email: string,
  isActive: boolean,
} | null> {
  return sessionRepo.getSessionByUserId(userId);
}

export default {
  createSession,
  deactivateSession,
  getSessionByRefreshToken,
  getSessionByUserId,
};
