'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
}

export default function PinnedAnnouncements() {
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
            <div className="animate-pulse text-gray-200">
                加载中...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500">
                {error}
            </div>
        );
    }

    if (!data || data.announcements.length === 0) {
        return (
            <div className="text-gray-200">
                暂无公告
            </div>
        );
    }

    // 只显示置顶公告
    const pinnedAnnouncements = data.announcements.filter(a => a.is_pinned);

    return (
        <div className="space-y-4">
            {/* 只显示公告内容 */}
            {pinnedAnnouncements.length > 0 ? (
                pinnedAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="text-gray-200">
                        <h3 className="font-medium">{announcement.title}</h3>
                        <p className="text-sm text-gray-300">{announcement.content}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-400 text-center">暂无置顶公告</p>
            )}
        </div>
    );
} 