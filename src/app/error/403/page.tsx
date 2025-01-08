import { ErrorPage } from '@/components/ui/error-page'
import { errorEmojis } from '@/config/error-emojis'

export default function Forbidden() {
  return (
    <ErrorPage
      code="403"
      icon={errorEmojis[403]}
      title="访问被拒绝"
      description="抱歉，您没有权限访问此页面。如果您认为这是一个错误，请联系管理员。"
      className="animate-fade-in"
    />
  )
} 