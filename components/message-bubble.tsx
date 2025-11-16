interface MessageBubbleProps {
  author: string
  avatar: string
  timestamp: string
  content: string
}

export function MessageBubble({ author, avatar, timestamp, content }: MessageBubbleProps) {
  const isUser = author === 'You'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white flex-shrink-0">
          {avatar}
        </div>
      )}
      <div className={`max-w-2xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`flex items-center gap-2 mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {isUser ? (
            <>
              <span className="text-xs text-muted-foreground">{timestamp}</span>
              <span className="text-sm font-semibold">{author}</span>
              <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {avatar && typeof avatar === 'string' && avatar.startsWith('http') ? (
                  <img src={avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </>
          ) : (
            <>
              <span className="text-sm font-semibold">{author}</span>
              <span className="text-xs text-muted-foreground">{timestamp}</span>
            </>
          )}
        </div>
        <div className={`rounded-lg px-4 py-2 ${isUser ? 'bg-purple-100 text-foreground' : 'text-foreground'}`}>
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  )
}
