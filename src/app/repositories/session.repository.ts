import { User, Session } from '../database/entities';

async function setUserSession(userId: number, refreshToken: string): Promise<void> {
  await Session.create({
    userId,
    refreshToken,
    isActive: true,
    signinDate: new Date(),
  });
}

async function setLogoutDate(userId: number): Promise<void> {
  const latestSession = await Session.findOne({
    where: {
      userId,
    },
    order: [['signinDate', 'DESC']],
  });

  if (latestSession && latestSession.isActive) {
    await latestSession.update({
      isActive: false,
      logoutDate: new Date(),
      refreshToken: null,
    });
  }
}

async function getSessionByRefreshToken(refreshToken: string): Promise<Session | null> {
  return Session.findOne({
    where: {
      refreshToken,
      isActive: true,
    },
  });
}

async function getSessionByUserId(userId: number): Promise<{
  id: number,
  email: string,
  isActive: boolean,
} | null> {
  const session = await Session.findOne({
    where: {
      userId,
      isActive: true,
    },
    include: [{
      model: User,
      attributes: ['email'],
    }],
  });

  if (session) {
    const user = await User.findByPk(session.userId) as User;
    return {
      id: session.userId,
      isActive: session.isActive,
      email: user.email,
    };
  }

  return null;
}

export default {
  setUserSession,
  setLogoutDate,
  getSessionByRefreshToken,
  getSessionByUserId,
};
