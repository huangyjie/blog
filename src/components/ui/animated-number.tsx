'use client'

import { useEffect, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  duration?: number
}

export const AnimatedNumber = ({ value, duration = 1000 }: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    let startTime: number
    let animationFrame: number
    const startValue = displayValue
    
    const updateNumber = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setDisplayValue(Math.floor(startValue + (value - startValue) * progress))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateNumber)
      }
    }
    
    animationFrame = requestAnimationFrame(updateNumber)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration])
  
  return <span>{displayValue}</span>
}