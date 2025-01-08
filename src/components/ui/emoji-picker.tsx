'use client'

import { useState, useRef } from 'react'
import { emojiGroups } from '@/config/emojis'
import { useClickOutside } from '@/hooks/useClickOutside'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  onClose: () => void
}

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null)
  useClickOutside(pickerRef, onClose)

  const [activeGroup, setActiveGroup] = useState<keyof typeof emojiGroups>('faces')

  return (
    <div ref={pickerRef} className="absolute bottom-full mb-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 w-72">
      {/* 表情分组标签 */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveGroup('faces')}
          className={`px-3 py-1 rounded-lg text-sm ${
            activeGroup === 'faces' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          表情
        </button>
        <button
          onClick={() => setActiveGroup('gestures')}
          className={`px-3 py-1 rounded-lg text-sm ${
            activeGroup === 'gestures' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          手势
        </button>
        <button
          onClick={() => setActiveGroup('hearts')}
          className={`px-3 py-1 rounded-lg text-sm ${
            activeGroup === 'hearts' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          爱心
        </button>
        <button
          onClick={() => setActiveGroup('animals')}
          className={`px-3 py-1 rounded-lg text-sm ${
            activeGroup === 'animals' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          动物
        </button>
        <button
          onClick={() => setActiveGroup('food')}
          className={`px-3 py-1 rounded-lg text-sm ${
            activeGroup === 'food' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          美食
        </button>
        <button
          onClick={() => setActiveGroup('weather')}
          className={`px-3 py-1 rounded-lg text-sm ${
            activeGroup === 'weather' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          天气
        </button>
        <button
          onClick={() => setActiveGroup('activities')}
          className={`px-3 py-1 rounded-lg text-sm ${
            activeGroup === 'activities' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          活动
        </button>
      </div>

      {/* 表情网格 */}
      <div className="grid grid-cols-8 gap-1">
        {emojiGroups[activeGroup].map((emoji) => (
          <button
            key={emoji.code}
            onClick={() => {
              onEmojiSelect(emoji.code)
              onClose()
            }}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded text-xl"
            title={emoji.name}
          >
            {emoji.code}
          </button>
        ))}
      </div>
    </div>
  )
} 