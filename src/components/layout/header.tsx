'use client'

import { useState } from 'react'
import { HamburgerButton } from '@/components/ui/hamburger-button'
import { Sidebar } from '@/components/layout/sidebar'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="fixed top-0 right-0 z-50 p-4"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isSidebarOpen ? 'open' : 'closed'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <HamburgerButton
              isOpen={isSidebarOpen}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-12 h-12 bg-transparent dark:bg-transparent backdrop-blur-md 
                rounded-full hover:bg-white/10 dark:hover:bg-white/10
                transition-all duration-200
                border border-white/10"
            />
          </motion.div>
        </AnimatePresence>
      </motion.header>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
} 