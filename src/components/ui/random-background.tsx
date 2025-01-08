'use client'

import { useEffect, useState } from 'react'

export function RandomBackground() {
  const [backgroundImage, setBackgroundImage] = useState('')

  useEffect(() => {
    // 使用动漫背景API
    setBackgroundImage('http://api.hsbogk.icu/imgs/HSBOGKAPI/')
  }, [])

  if (!backgroundImage) {
    return null
  }

  return (
    <div 
      className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
    >
      <iframe 
        src={backgroundImage}
        className="absolute inset-0 w-full h-full border-0"
        style={{
          pointerEvents: 'none' // 禁止iframe交互
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  )
} 