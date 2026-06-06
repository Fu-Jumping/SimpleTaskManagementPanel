import jwt from 'jsonwebtoken';
import { sendUnauthorized } from '../utils/response.js';
import { db } from '../db/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendUnauthorized(res, '未登录或token无效');
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!db.data) {
      await db.read();
    }
    
    const user = db.data.users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return sendUnauthorized(res, '用户不存在');
    }
    
    req.user = user;
    next();
  } catch (error) {
    return sendUnauthorized(res, 'token无效或已过期');
  }
}
