'use client';

import { useState, useEffect } from 'react';

interface QuoteResponse {
    content: string;
    author: string;
    source: string;
}

export default function RandomQuote() {
    const [quote, setQuote] = useState<QuoteResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchNewQuote = async () => {
        if (loading) return;
        
        setLoading(true);
        try {
            const response = await fetch('/api/quotes');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setQuote(data);
        } catch (error) {
            console.error('获取一言失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNewQuote();
    }, []);

    return (
        <div 
            onClick={fetchNewQuote}
            className={`text-gray-200 text-sm ${loading ? 'animate-pulse' : ''}`}
        >
            『{quote?.content || '加载中...'}』
            {quote && (
                <p className="text-gray-400 text-xs text-right mt-1">
                    —— {quote.author ? `${quote.author}「${quote.source}」` : quote.source}
                </p>
            )}
        </div>
    );
} 