import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Announcement {
  id: number;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

interface AnnouncementFormProps {
  announcement?: Announcement | null;
  onSuccess?: () => void;
  onSubmitSuccess?: () => void;
}

export default function AnnouncementForm({ announcement, onSuccess, onSubmitSuccess }: AnnouncementFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setContent(announcement.content);
      setIsPinned(announcement.is_pinned);
    }
  }, [announcement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = announcement 
        ? `/api/announcements/${announcement.id}`
        : '/api/announcements';
      
      const method = announcement ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          is_pinned: isPinned,
        }),
      });

      if (!response.ok) {
        throw new Error('提交失败');
      }

      setTitle('');
      setContent('');
      setIsPinned(false);
      alert(announcement ? '公告更新成功！' : '公告发布成功！');
      
      // 调用两个回调函数
      onSuccess?.();
      onSubmitSuccess?.();
    } catch (error) {
      alert('操作失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-1">
          公告标题
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-1">
          公告内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
          required
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPinned"
          checked={isPinned}
          onChange={(e) => setIsPinned(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-white/20 rounded focus:ring-blue-500"
        />
        <label htmlFor="isPinned" className="ml-2 text-sm font-medium text-gray-200">
          置顶公告
        </label>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '提交中...' : announcement ? '更新公告' : '发布公告'}
      </button>
    </form>
  );
} 