// 统一请求模块：自动加 token、统一解包 { success, data }、抛出错误 message
// 所有接口请求都通过此模块发送，不直接使用 fetch。
import { API_CONFIG } from './config';
import { clearSession, getStoredToken, notifyUnauthorized } from '../utils/session';

// 把对象转成 URL 查询字符串，跳过空值
function toQueryString(params) {
  const parts = [];
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });
  return parts.length ? `?${parts.join('&')}` : '';
}

async function request(method, path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // GET 请求把 params 拼成查询字符串，其它方法放 body
  let url = `${API_CONFIG.baseURL}${path}`;
  const fetchOptions = { method, headers };

  if (method === 'GET' && options.params) {
    url += toQueryString(options.params);
  } else if (options.body !== undefined) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  let res;
  try {
    res = await fetch(url, fetchOptions);
  } catch (err) {
    throw new Error('网络异常，请检查后端服务是否已启动');
  }

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`服务器响应异常 (${res.status})`);
  }

  if (!json.success) {
    if (res.status === 401) {
      clearSession();
      notifyUnauthorized();
    }
    throw new Error(json.message || `请求失败 (${res.status})`);
  }

  return json.data;
}

// 便捷方法
export const api = {
  get(path, params) {
    return request('GET', path, { params });
  },
  post(path, body) {
    return request('POST', path, { body });
  },
  patch(path, body) {
    return request('PATCH', path, { body });
  },
  delete(path) {
    return request('DELETE', path);
  }
};
