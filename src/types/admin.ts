export type AdminRole = 'super_admin' | 'admin' | 'editor'

export interface AdminCard {
  title: string
  description: string
  icon: string
  href: string
  requiredRole: AdminRole
} 