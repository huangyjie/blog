import { ErrorPage } from '@/components/ui/error-page'
import { errorEmojis } from '@/config/error-emojis'

export default function MethodNotAllowed() {
  return (
    <ErrorPage
      code="405"
      icon={errorEmojis[405]}
      title="请求方法不允许"
      description="抱歉，服务器不支持此请求方法。请使用正确的HTTP方法重试。"
      className="animate-fade-in"
    />
  )
} 