// API 配置：默认请求真实后端；测试环境和显式 VITE_USE_MOCK=true 时使用 Mock。
export const API_CONFIG = {
  useMock: import.meta.env.MODE === 'test' || import.meta.env.VITE_USE_MOCK === 'true',
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
};
