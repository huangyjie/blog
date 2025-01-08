import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import type { AdminRole } from '@/types/admin'

export function useAdminAuth(requiredRole?: AdminRole) {
  const router = useRouter()
  const { data, error, isLoading } = useSWR('/api/admin/check-auth', async (url) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('验证失败')
    return res.json()
  })

  useEffect(() => {
    if (!isLoading) {
      if (!data?.authenticated) {
        router.push('/admin/login')
      }
      // 如果指定了所需权限，则进行权限验证
      else if (requiredRole && data.role) {
        const roleHierarchy: Record<AdminRole, number> = {
          super_admin: 3,
          admin: 2,
          editor: 1
        }
        
        if (roleHierarchy[data.role as AdminRole] < roleHierarchy[requiredRole]) {
          router.push('/admin')
        }
      }
    }
  }, [data, isLoading, router, requiredRole])

  return {
    isAuthenticated: data?.authenticated,
    isValidating: isLoading,
    user: data?.user,
    role: data?.role as AdminRole
  }
} 