'use client'

interface HamburgerButtonProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function HamburgerButton({ isOpen, onClick, className = '' }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col justify-center items-center w-12 h-12 
        bg-white/10 backdrop-blur-sm rounded-full 
        hover:bg-white/20 hover:scale-110
        active:scale-95
        shadow-lg shadow-black/5
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-white/20
        ${className}`}
      aria-label={isOpen ? '关闭菜单' : '打开菜单'}
    >
      <span
        className={`block w-5 h-0.5 bg-current rounded-full 
          transition-all duration-300 ease-out
          ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}
      />
      <span
        className={`block w-5 h-0.5 bg-current rounded-full mt-1
          transition-all duration-300 ease-out
          ${isOpen ? 'opacity-0 scale-0' : ''}`}
      />
      <span
        className={`block w-5 h-0.5 bg-current rounded-full mt-1
          transition-all duration-300 ease-out
          ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
      />
    </button>
  )
} 