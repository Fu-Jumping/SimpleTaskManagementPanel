// API 配置：一键切换 Mock / 真实后端
// useMock = true   → 使用本地 Mock 数据（前端独立开发）
// useMock = false  → 请求真实后端（需要后端已启动）
export const API_CONFIG = {
  useMock: true,
  baseURL: 'http://localhost:3000/api'
};
