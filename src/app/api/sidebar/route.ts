import { NextResponse } from 'next/server'
import { navigationConfig } from '@/config/navigation'

export async function GET() {
  const sidebarHtml = `
    <div class="sidebar-content">
      <div class="sidebar-header">
        <h2>导航菜单</h2>
      </div>
      <nav class="nav-links">
        ${navigationConfig[0].items.map(item => `
          <a href="${item.href}" class="nav-link">
            ${item.title}
          </a>
        `).join('')}
      </nav>
      <style>
        .sidebar-content {
          padding: 20px;
          height: 100%;
          overflow-y: auto;
        }
        .sidebar-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .sidebar-header h2 {
          margin: 0;
          color: inherit;
        }
        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .nav-link {
          padding: 10px;
          text-decoration: none;
          color: inherit;
          border-radius: 5px;
          transition: background-color 0.3s;
        }
        .nav-link:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      </style>
    </div>
  `

  return new NextResponse(sidebarHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
} 