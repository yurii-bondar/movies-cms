import usersRepo from '../repositories/user.repository';
import { User } from '../database/entities';

async function getUserByEmail(email: string): Promise<User | null> {
  return usersRepo.findByEmail(email);
}

async function registerUser(email: string, name: string, password: string): Promise<User> {
  return usersRepo.createUser(email, name, password);
}

async function updateLastSignInDate(userId: number): Promise<void> {
  await usersRepo.updateLastSignInDate(userId);
}

async function getUserById(id: number): Promise<User | null> {
  return usersRepo.getUserById(id);
}

export default {
  getUserByEmail,
  registerUser,
  updateLastSignInDate,
  getUserById,
};
