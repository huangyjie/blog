'use client'

import { useEffect } from 'react'
import { ErrorPage } from '@/components/ui/error-page'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorPage
      code="Error"
      title="出错了"
      description={error.message || "发生了一些错误，请稍后再试。"}
    />
  )
} 