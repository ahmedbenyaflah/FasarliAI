'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { ChatArea } from '@/components/chat-area'
import { QuizPanel } from '@/components/quiz-panel'
import { ChatHistory } from '@/components/chat-history'
import { FlashcardPanel } from '@/components/flashcard-panel'

type ViewMode = 'chat' | 'quiz' | 'flashcards'

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && (
        <Sidebar 
          viewMode={viewMode} 
          onViewChange={setViewMode}
          isOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dynamic Content based on View Mode */}
        <div className="flex flex-1 overflow-hidden">
          {/* Side Panel (Quiz, Flashcards, or Chat History) */}
          {viewMode === 'quiz' && sidebarOpen && <QuizPanel />}
          {viewMode === 'flashcards' && sidebarOpen && <FlashcardPanel />}
          {viewMode === 'chat' && sidebarOpen && <ChatHistory />}

          {/* Main Chat Area - Pass sidebar toggle handler */}
          <ChatArea 
            viewMode={viewMode}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      </div>
    </div>
  )
}
