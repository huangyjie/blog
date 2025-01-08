'use client';

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
    text: string;
    delay?: number;
    className?: string;
}

export default function TypewriterText({ text, delay = 100, className = '' }: TypewriterTextProps) {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, text, delay]);

    return <span className={className}>{displayText}</span>;
} 