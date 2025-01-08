'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  size: number
  color: string
}

export function ClickParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置canvas大小
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // 创建粒子
    const createParticles = (x: number, y: number) => {
      const colors = ['#60A5FA', '#34D399', '#F472B6', '#A78BFA']
      const particles: Particle[] = []
      
      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20
        const velocity = 2 + Math.random() * 2
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          alpha: 1,
          size: 3 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
      
      particlesRef.current = particles
    }

    // 动画循环
    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.alpha *= 0.96
        particle.size *= 0.97

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`
        ctx.fill()

        if (particle.alpha < 0.01) {
          particlesRef.current.splice(i, 1)
        }
      })

      if (particlesRef.current.length > 0) {
        requestAnimationFrame(animate)
      }
    }

    // 点击事件处理
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      createParticles(x, y)
      animate()
    }

    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      window.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  )
} 