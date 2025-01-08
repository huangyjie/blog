'use client';

import { useState, useEffect } from 'react';
import { RandomBackground } from '@/components/ui/random-background';
import Link from 'next/link';

// 添加全局样式来隐藏滚动条
const globalStyles = `
  /* 隐藏默认滚动条 */
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  /* 为了兼容 Firefox */
  * {
    scrollbar-width: none;
  }

  /* 为了兼容 IE */
  * {
    -ms-overflow-style: none;
  }
`;

interface Announcement {
    id: number;
    title: string;
    content: string;
    is_pinned: boolean;
    created_at: string;
}

interface AnnouncementsResponse {
    announcements: Announcement[];
    total: number;
    page: number;
    per_page: number;
}

export default function AnnouncementsPage() {
    const [data, setData] = useState<AnnouncementsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // 添加全局样式
    useEffect(() => {
        // 创建 style 元素
        const style = document.createElement('style');
        style.textContent = globalStyles;
        document.head.appendChild(style);

        // 清理函数
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // 添加阻止默认滑动行为
    useEffect(() => {
        // 阻止默认的手势事件
        const preventGestures = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        // 阻止鼠标事件
        const preventMouseGestures = (e: MouseEvent) => {
            if (e.buttons === 2) { // 右键被按下
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };
        
        // 禁用手势相关事件
        document.addEventListener('gesturestart', preventGestures, { capture: true });
        document.addEventListener('gesturechange', preventGestures, { capture: true });
        document.addEventListener('gestureend', preventGestures, { capture: true });
        
        // 禁用触摸相关手势
        document.addEventListener('touchstart', preventGestures, { passive: false, capture: true });
        document.addEventListener('touchmove', preventGestures, { passive: false, capture: true });
        document.addEventListener('touchend', preventGestures, { passive: false, capture: true });

        // 禁用鼠标手势
        document.addEventListener('mousedown', preventMouseGestures, { capture: true });
        document.addEventListener('mousemove', preventMouseGestures, { capture: true });
        document.addEventListener('mouseup', preventMouseGestures, { capture: true });
        document.addEventListener('drag', preventGestures, { capture: true });
        document.addEventListener('dragstart', preventGestures, { capture: true });

        // 清理函数
        return () => {
            document.removeEventListener('gesturestart', preventGestures);
            document.removeEventListener('gesturechange', preventGestures);
            document.removeEventListener('gestureend', preventGestures);
            document.removeEventListener('touchstart', preventGestures);
            document.removeEventListener('touchmove', preventGestures);
            document.removeEventListener('touchend', preventGestures);
            document.removeEventListener('mousedown', preventMouseGestures);
            document.removeEventListener('mousemove', preventMouseGestures);
            document.removeEventListener('mouseup', preventMouseGestures);
            document.removeEventListener('drag', preventGestures);
            document.removeEventListener('dragstart', preventGestures);
        };
    }, []);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`/api/announcements?page=${currentPage}&per_page=10`);
                if (!response.ok) {
                    throw new Error('获取公告失败');
                }
                const data = await response.json();
                setData(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching announcements:', error);
                setError('获取公告失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, [currentPage]);

    const totalPages = data && data.total && data.per_page 
        ? Math.max(1, Math.ceil(data.total / data.per_page))
        : 1;

    return (
        <div className="min-h-screen">
            <RandomBackground />
            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* 顶部导航 */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">全部公告</h1>
                    <Link
                        href="/"
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-white rounded-lg transition-colors"
                    >
                        返回首页
                    </Link>
                </div>

                {/* 公告列表 */}
                {loading ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                        <div className="animate-pulse text-center text-gray-200">
                            加载中...
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                        <div className="text-center text-red-500">
                            {error}
                        </div>
                    </div>
                ) : !data || data.announcements.length === 0 ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                        <div className="text-center text-gray-200">
                            暂无公告
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.announcements.map((announcement) => (
                            <div
                                key={announcement.id}
                                className={`p-6 rounded-lg border transition-all ${
                                    announcement.is_pinned
                                        ? 'bg-blue-50/10 border-blue-200/20'
                                        : 'bg-white/10 border-white/20'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    {announcement.is_pinned && (
                                        <span className="px-2 py-1 text-xs bg-blue-100/20 text-blue-200 rounded">
                                            置顶
                                        </span>
                                    )}
                                    <h3 className="text-lg font-semibold text-white">
                                        {announcement.title}
                                    </h3>
                                </div>
                                <p className="text-gray-200 whitespace-pre-wrap mb-2">
                                    {announcement.content}
                                </p>
                                <div className="text-sm text-gray-400">
                                    发布于: {new Date(announcement.created_at).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 分页控制 */}
                {data && data.announcements.length > 0 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                currentPage === 1
                                    ? 'bg-gray-500/50 cursor-not-allowed'
                                    : 'bg-blue-500/20 hover:bg-blue-500/30'
                            } text-white`}
                        >
                            上一页
                        </button>
                        <span className="px-4 py-2 text-white">
                            {currentPage} / {Math.max(1, totalPages)}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                currentPage === totalPages
                                    ? 'bg-gray-500/50 cursor-not-allowed'
                                    : 'bg-blue-500/20 hover:bg-blue-500/30'
                            } text-white`}
                        >
                            下一页
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
} 