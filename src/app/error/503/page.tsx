import { ErrorPage } from '@/components/ui/error-page'
import { errorEmojis } from '@/config/error-emojis'

export default function ServiceUnavailable() {
  return (
    <ErrorPage
      code="503"
      icon={errorEmojis[503]}
      title="服务暂时不可用"
      description="抱歉，服务器正在维护中。请稍后再试，感谢您的耐心等待。"
      className="animate-fade-in"
    />
  )
} 