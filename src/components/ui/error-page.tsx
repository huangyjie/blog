import Link from 'next/link'
import { RandomBackground } from './random-background'

interface ErrorPageProps {
  code: string
  icon?: string
  title: string
  description: string
  className?: string
}

export function ErrorPage({
  code,
  icon,
  title,
  description,
  className = ''
}: ErrorPageProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          {icon && <div className="text-6xl mb-4">{icon}</div>}
          <h1 className="text-4xl font-bold text-gray-800">{code}</h1>
          <h2 className="text-2xl font-semibold text-gray-700">{title}</h2>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">{description}</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          返回上一页
        </button>
      </div>
    </div>
  )
} 