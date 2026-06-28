export function success(data = {}) {
  return {
    success: true,
    data
  };
}

export function error(message = '服务器错误') {
  return {
    success: false,
    message
  };
}

export function sendSuccess(res, data = {}) {
  res.json(success(data));
}

export function sendError(res, message = '服务器错误', status = 400) {
  res.status(status).json(error(message));
}

export function sendNotFound(res, message = '资源不存在') {
  sendError(res, message, 404);
}

export function sendUnauthorized(res, message = '未登录或token无效') {
  sendError(res, message, 401);
}

export function sendForbidden(res, message = '无权限访问该资源') {
  sendError(res, message, 403);
}
