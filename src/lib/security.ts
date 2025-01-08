// 过滤 XSS 攻击字符
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 验证邮箱格式
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 内容长度限制和验证
export const CONTENT_LIMITS = {
  nickname: {
    min: 2,
    max: 20
  },
  content: {
    min: 5,
    max: 500
  }
};

// 验证内容
export function validateContent(
  type: 'nickname' | 'content',
  value: string
): { isValid: boolean; message?: string } {
  const limit = CONTENT_LIMITS[type];
  
  if (value.length < limit.min) {
    return {
      isValid: false,
      message: `${type === 'nickname' ? '昵称' : '内容'}不能少于${limit.min}个字符`
    };
  }
  
  if (value.length > limit.max) {
    return {
      isValid: false,
      message: `${type === 'nickname' ? '昵称' : '内容'}不能超过${limit.max}个字符`
    };
  }

  // 检查是否包含特殊字符
  const specialChars = /[<>{}$]/g;
  if (specialChars.test(value)) {
    return {
      isValid: false,
      message: '内容包含非法字符'
    };
  }

  return { isValid: true };
} 