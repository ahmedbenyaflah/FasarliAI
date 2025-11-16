'use client'

import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const chatHistoryData = {
  today: [
    'How to be a better person?',
    'Hacking FBI server with linux',
    'How to get rich from youtube as an influ...',
    'Help me with web development tasks fr...',
    'REACT NEXTJS Tutorial',
  ],
  previous7Days: [],
}

export function ChatHistory() {
  return (
    <div className="w-80 bg-card border-r border-border p-6 space-y-4 overflow-y-auto">
      <h2 className="text-lg font-semibold">Chat History</h2>

      <div className="space-y-4">
        {/* Today Section */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between px-2 font-semibold text-foreground hover:bg-transparent"
          >
            Today
            <ChevronDown className="w-4 h-4" />
          </Button>
          <div className="space-y-1 pl-2">
            {chatHistoryData.today.map((item, idx) => (
              <button
                key={idx}
                className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  idx === 2 ? 'bg-purple-100 text-purple-600 border-l-2 border-purple-600' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Previous 7 Days Section */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between px-2 font-semibold text-foreground hover:bg-transparent"
          >
            Previous 7 Days
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-xs text-muted-foreground">💜 Enjoy your experience...</p>
      </div>
    </div>
  )
}
