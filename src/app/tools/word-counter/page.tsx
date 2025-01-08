'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'

interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  lines: number
  paragraphs: number
  chinese: number
  english: number
  numbers: number
  spaces: number
  punctuation: number
}

export default function WordCounterPage() {
  const [text, setText] = useState('')
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    chinese: 0,
    english: 0,
    numbers: 0,
    spaces: 0,
    punctuation: 0
  })

  const analyzeText = useCallback((input: string) => {
    // 计算基本统计
    const characters = input.length
    const charactersNoSpaces = input.replace(/\s/g, '').length
    const words = input.trim().split(/\s+/).filter(word => word.length > 0).length
    const lines = input.split(/\r\n|\r|\n/).length
    const paragraphs = input.split(/\r\n\r\n|\r\r|\n\n/).filter(para => para.trim().length > 0).length
    
    // 计算详细统计
    const chinese = (input.match(/[\u4e00-\u9fa5]/g) || []).length
    const english = (input.match(/[a-zA-Z]/g) || []).length
    const numbers = (input.match(/[0-9]/g) || []).length
    const spaces = (input.match(/\s/g) || []).length
    const punctuation = (input.match(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~。，、；：？！…—·ˉ¨''""々～‖∶＂＇｀｜〃〔〕〈〉《》「」『』．〖〗【】（）［］｛｝]/g) || []).length

    setStats({
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      chinese,
      english,
      numbers,
      spaces,
      punctuation
    })
  }, [])

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    analyzeText(newText)
  }, [analyzeText])

  const clearText = useCallback(() => {
    setText('')
    analyzeText('')
  }, [analyzeText])

  useGlobalStyles();

  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">字数统计</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-white">输入文本:</label>
              <button
                onClick={clearText}
                className="px-4 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                清空
              </button>
            </div>
            <textarea
              value={text}
              onChange={handleTextChange}
              className="w-full h-[200px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
              placeholder="在此输入或粘贴要统计的文本..."
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-1">总字符数</h3>
              <p className="text-2xl font-bold text-white">{stats.characters}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-1">不含空格字符数</h3>
              <p className="text-2xl font-bold text-white">{stats.charactersNoSpaces}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-1">单词数</h3>
              <p className="text-2xl font-bold text-white">{stats.words}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-1">行数</h3>
              <p className="text-2xl font-bold text-white">{stats.lines}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-1">段落数</h3>
              <p className="text-2xl font-bold text-white">{stats.paragraphs}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-1">中文字数</h3>
              <p className="text-2xl font-bold text-white">{stats.chinese}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-1">英文字母数</h3>
              <p className="text-2xl font-bold text-white">{stats.english}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-1">数字个数</h3>
              <p className="text-2xl font-bold text-white">{stats.numbers}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-1">空格数</h3>
              <p className="text-2xl font-bold text-white">{stats.spaces}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-1">标点符号数</h3>
              <p className="text-2xl font-bold text-white">{stats.punctuation}</p>
            </div>
          </div>

          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">统计说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>总字符数：包含所有字符（含空格、换行等）</li>
              <li>不含空格字符数：不包含空格、制表符、换行符</li>
              <li>单词数：以空格分隔的单词个数</li>
              <li>行数：文本的总行数（含空行）</li>
              <li>段落数：以空行分隔的段落数</li>
              <li>支持中英文混合统计</li>
              <li>标点符号包含中英文标点</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 