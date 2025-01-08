// 用于存储短链接映射的简单内存存储
export const urlMap = new Map<string, {
  url: string
  expiresAt?: Date
}>() 