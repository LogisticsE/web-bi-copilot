import { User } from './types';

// Hardcoded users for demo - in production, use a proper auth system
const USERS: Record<string, { password: string; user: User }> = {
  'admin@admin.com': {
    password: 'Admin123',
    user: {
      email: 'admin@admin.com',
      role: 'admin',
      name: 'Administrator',
    },
  },
  'user@user.com': {
    password: 'User123',
    user: {
      email: 'user@user.com',
      role: 'user',
      name: 'Standard User',
    },
  },
};

export function validateCredentials(email: string, password: string): User | null {
  const userRecord = USERS[email.toLowerCase()];
  if (userRecord && userRecord.password === password) {
    return userRecord.user;
  }
  return null;
}

export function getUserByEmail(email: string): User | null {
  const userRecord = USERS[email.toLowerCase()];
  return userRecord?.user || null;
}
