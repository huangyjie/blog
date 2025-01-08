import { ErrorPage } from '@/components/ui/error-page'
import { errorEmojis } from '@/config/error-emojis'

export default function BadRequest() {
  return (
    <ErrorPage
      code="400"
      icon={errorEmojis[400]}
      title="错误请求"
      description="抱歉，服务器无法理解您的请求。请检查您的请求语法是否正确，然后重试。"
      className="animate-fade-in"
    />
  )
} 