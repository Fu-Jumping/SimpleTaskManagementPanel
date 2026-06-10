import { describe, it, expect } from 'vitest';
import { highlight } from './highlight';

describe('highlight 关键词高亮', () => {
  it('无关键词时返回转义后的原文', () => {
    expect(highlight('完成接口文档', '')).toBe('完成接口文档');
  });

  it('命中关键词时用 mark 包裹', () => {
    expect(highlight('完成接口文档', '接口')).toBe(
      '完成<mark class="hl">接口</mark>文档'
    );
  });

  it('大小写不敏感', () => {
    expect(highlight('Fix API bug', 'api')).toBe(
      'Fix <mark class="hl">API</mark> bug'
    );
  });

  it('转义 HTML 防止注入', () => {
    expect(highlight('<script>x</script>', '')).toBe(
      '&lt;script&gt;x&lt;/script&gt;'
    );
  });

  it('关键词含正则特殊字符不报错', () => {
    expect(highlight('价格 a.b 元', '.')).toContain('mark');
  });
});
