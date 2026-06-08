// 认证相关请求
// 提供两套实现：
//   1. mockXxx() — 本地模拟，前端独立开发时用
//   2. login/register/getMe() — 根据 API_CONFIG.useMock 自动切换 mock/真实后端
// 字段严格遵守 docs/api.md。

import { API_CONFIG } from './config';
import { api } from './request';

// ===== Mock 实现 =====

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockLogin(username, password) {
  await delay();
  if (!username || !password) {
    throw new Error('用户名或密码不能为空');
  }
  return {
    user: { id: 'user_mock_001', username },
    token: `mock-token-${Date.now()}`
  };
}

export async function mockRegister(username, password) {
  await delay();
  if (!username || !password) {
    throw new Error('用户名或密码不能为空');
  }
  return {
    user: { id: 'user_mock_001', username },
    token: `mock-token-${Date.now()}`
  };
}

export async function mockGetMe() {
  await delay();
  const token = localStorage.getItem('tb_token');
  if (!token) throw new Error('未登录');
  const user = JSON.parse(localStorage.getItem('tb_user') || '{}');
  return { user };
}

// ===== 统一导出的接口函数（自动切换 mock/真实） =====

export async function login(username, password) {
  if (API_CONFIG.useMock) return mockLogin(username, password);
  return api.post('/auth/login', { username, password });
}

export async function register(username, password) {
  if (API_CONFIG.useMock) return mockRegister(username, password);
  return api.post('/auth/register', { username, password });
}

export async function getMe() {
  if (API_CONFIG.useMock) return mockGetMe();
  return api.get('/auth/me');
}
