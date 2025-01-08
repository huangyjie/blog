import { ErrorPage } from '@/components/ui/error-page'
import { errorEmojis } from '@/config/error-emojis'

export default function NotAcceptable() {
  return (
    <ErrorPage
      code="406"
      icon={errorEmojis[406]}
      title="无法接受的请求"
      description="抱歉，服务器无法根据请求的内容特性完成请求。请检查请求头的Accept相关信息。"
      className="animate-fade-in"
    />
  )
} 