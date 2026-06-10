// 关键词高亮工具：把文本里命中关键词的部分包成 <mark>，返回 HTML 字符串
// 用于搜索筛选时高亮任务标题和描述中的关键词。

// 转义正则特殊字符，避免用户输入的关键词破坏正则
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 转义 HTML，防止任务内容里的尖括号等被当成标签（避免 XSS）
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 返回高亮后的 HTML：命中处用 <mark class="hl"> 包裹
export function highlight(text, keyword) {
  const safeText = escapeHtml(text || '');
  const kw = (keyword || '').trim();
  if (!kw) return safeText;
  const re = new RegExp(`(${escapeRegExp(escapeHtml(kw))})`, 'gi');
  return safeText.replace(re, '<mark class="hl">$1</mark>');
}
