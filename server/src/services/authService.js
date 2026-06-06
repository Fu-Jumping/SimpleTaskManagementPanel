import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { db, saveDb } from '../db/index.js';
import { validateUser } from '../utils/validators.js';
import { createSampleTasks } from './sampleService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
const JWT_EXPIRES_IN = '7d';

export async function register(username, password) {
  const errors = validateUser({ username, password });
  if (errors.length > 0) {
    return { success: false, message: errors.join('; ') };
  }
  
  if (!db.data) {
    await db.read();
  }
  
  const existingUser = db.data.users.find(u => u.username === username);
  if (existingUser) {
    return { success: false, message: '用户名已存在' };
  }
  
  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();
  
  const user = {
    id: `user_${nanoid(8)}`,
    username,
    passwordHash,
    createdAt: now
  };
  
  db.data.users.push(user);
  await saveDb();
  
  await createSampleTasks(user.id);
  
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  
  return {
    success: true,
    data: {
      user: { id: user.id, username: user.username },
      token
    }
  };
}

export async function login(username, password) {
  if (!db.data) {
    await db.read();
  }
  
  const user = db.data.users.find(u => u.username === username);
  
  if (!user) {
    return { success: false, message: '用户名或密码错误' };
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  
  if (!isPasswordValid) {
    return { success: false, message: '用户名或密码错误' };
  }
  
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  
  return {
    success: true,
    data: {
      user: { id: user.id, username: user.username },
      token
    }
  };
}

export function getUserById(userId) {
  if (!db.data) {
    return null;
  }
  
  const user = db.data.users.find(u => u.id === userId);
  
  if (!user) {
    return null;
  }
  
  return { id: user.id, username: user.username };
}
