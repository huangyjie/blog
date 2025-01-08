'use client';

import { useEffect, useState } from 'react';

interface Announcement {
    id: number;
    title: string;
    content: string;
    is_pinned: boolean;
    created_at: string;
    updated_at: string;
}

interface AnnouncementsResponse {
    announcements: Announcement[];
    total: number;
    page: number;
    per_page: number;
}

export default function Announcements() {
    const [data, setData] = useState<AnnouncementsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch('/api/announcements');
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
    }, []);

    if (loading) {
        return (
            <div className="p-4 text-center">
                <div className="animate-pulse">加载中...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center text-red-500">
                {error}
            </div>
        );
    }

    if (!data || data.announcements.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                暂无公告
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {data.announcements.map((announcement) => (
                <div
                    key={announcement.id}
                    className={`p-4 rounded-lg border transition-all ${
                        announcement.is_pinned
                            ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                            : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                    }`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        {announcement.is_pinned && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded dark:bg-blue-900 dark:text-blue-200">
                                置顶
                            </span>
                        )}
                        <h3 className="text-lg font-semibold">{announcement.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                        {announcement.content}
                    </p>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        发布于: {new Date(announcement.created_at).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
} 