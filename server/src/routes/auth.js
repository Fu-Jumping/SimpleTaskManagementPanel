import { Router } from 'express';
import { register, login, getUserById } from '../services/authService.js';
import { authenticate } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return sendError(res, '用户名和密码不能为空');
  }
  
  const result = await register(username, password);
  
  if (result.success) {
    sendSuccess(res, result.data);
  } else {
    sendError(res, result.message);
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return sendError(res, '用户名和密码不能为空');
  }
  
  const result = await login(username, password);
  
  if (result.success) {
    sendSuccess(res, result.data);
  } else {
    sendError(res, result.message);
  }
});

router.get('/me', authenticate, (req, res) => {
  const user = getUserById(req.user.id);
  
  if (user) {
    sendSuccess(res, { user });
  } else {
    sendError(res, '用户不存在');
  }
});

export default router;
