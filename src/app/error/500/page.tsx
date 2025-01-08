import { ErrorPage } from '@/components/ui/error-page'
import { errorEmojis } from '@/config/error-emojis'

export default function InternalServerError() {
  return (
    <ErrorPage
      code="500"
      icon={errorEmojis[500]}
      title="服务器错误"
      description="抱歉，服务器出现了一些问题。我们正在努力修复，请稍后再试。"
      className="animate-fade-in"
    />
  )
} 