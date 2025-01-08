'use client'

import { useRouter } from 'next/navigation'
import { RandomBackground } from '@/components/ui/random-background'
import Sidebar from './Sidebar'
import { useAdminAuth } from '@/hooks/useAdminAuth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isValidating } = useAdminAuth()

  if (!isValidating && !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen">
      <RandomBackground />
      <Sidebar />
      <main className="ml-64">
        {children}
      </main>
    </div>
  )
} 