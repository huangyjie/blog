import { ErrorPage } from '@/components/ui/error-page'
import { errorEmojis } from '@/config/error-emojis'

export default function Unauthorized() {
  return (
    <ErrorPage
      code="401"
      icon={errorEmojis[401]}
      title="需要登录"
      description="抱歉，您需要登录后才能访问此页面。请先登录或注册一个账号。"
      className="animate-fade-in"
    />
  )
} 