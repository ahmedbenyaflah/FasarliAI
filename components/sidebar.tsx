'use client'

import { Menu, Zap, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ViewMode = 'chat' | 'quiz' | 'flashcards'

interface SidebarProps {
  viewMode: ViewMode
  onViewChange: (mode: ViewMode) => void
  isOpen: boolean
  onToggleSidebar: () => void
}

export function Sidebar({ viewMode, onViewChange, isOpen, onToggleSidebar }: SidebarProps) {
  return (
    <div className="w-16 bg-gradient-to-b from-purple-600 to-blue-600 flex flex-col items-center py-4 gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="text-white hover:bg-white/20"
      >
        <Menu className="w-6 h-6" />
      </Button>

      <nav className="flex flex-col gap-4 flex-1">
        <Button
          variant={viewMode === 'chat' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onViewChange('chat')}
          className={viewMode === 'chat' ? 'bg-white text-purple-600 hover:bg-white' : 'text-white hover:bg-white/20'}
          title="Chat"
        >
          <Zap className="w-6 h-6" />
        </Button>

        <Button
          variant={viewMode === 'quiz' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onViewChange('quiz')}
          className={viewMode === 'quiz' ? 'bg-white text-purple-600 hover:bg-white' : 'text-white hover:bg-white/20'}
          title="Quiz"
        >
          <BookOpen className="w-6 h-6" />
        </Button>

        <Button
          variant={viewMode === 'flashcards' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onViewChange('flashcards')}
          className={viewMode === 'flashcards' ? 'bg-white text-purple-600 hover:bg-white' : 'text-white hover:bg-white/20'}
          title="Flashcards"
        >
          <BookOpen className="w-6 h-6" />
        </Button>
      </nav>

      <div className="w-10 h-10 rounded-full bg-blue-400 opacity-80" />
    </div>
  )
}
