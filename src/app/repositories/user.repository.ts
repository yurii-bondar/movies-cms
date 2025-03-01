import { User } from '../database/entities';

async function findByEmail(email: string): Promise<User | null> {
  return User.findOne({ where: { email } });
}

async function createUser(email: string, name: string, password: string): Promise<User> {
  return User.create({ email, name, password });
}

async function updateLastSignInDate(userId: number): Promise<void> {
  await User.update(
    { lastSignInDate: new Date() },
    { where: { id: userId } },
  );
}

async function getUserById(id: number): Promise<User | null> {
  return User.findByPk(id);
}

export default {
  findByEmail,
  createUser,
  updateLastSignInDate,
  getUserById,
};
