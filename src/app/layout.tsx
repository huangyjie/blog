import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/layout/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "H's blog circle",
  description: '分享知识，传播价值',
  icons: {
    icon: [
      {
        url: 'https://q1.qlogo.cn/g?b=qq&nk=1401466869&s=100',
        sizes: '32x32',
        type: 'image/png',
      }
    ]
  },
}

export const dynamic = 'force-dynamic'
export const revalidate = 60 // 60秒后重新验证数据

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://q1.qlogo.cn/g?b=qq&nk=1401466869&s=100" />
      </head>
      <body className="bg-white dark:bg-gray-800 min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8 mt-16 md:mt-4">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
} 