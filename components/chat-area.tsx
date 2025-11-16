'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Sun, Moon, Settings, Menu, Upload, FileText, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageBubble } from './message-bubble'
import { SourcesPanel } from './sources-panel'
import { useSession } from '@/contexts/session-context'
import { useAuth } from '@/contexts/auth-context'
import { getUser } from '@/lib/supabase/database'
import { toast } from 'sonner'

interface ChatAreaProps {
  viewMode: 'chat' | 'quiz' | 'flashcards'
  sidebarOpen?: boolean
  onToggleSidebar?: () => void
}

interface Message {
  id: string
  author: string
  avatar?: string
  timestamp: string
  content: string
  sources?: Array<{ title: string; description: string; url?: string }>
}

export function ChatArea({ viewMode, sidebarOpen, onToggleSidebar }: ChatAreaProps) {
  const { sessionId, setSessionId, pdfName, setPdfName, conversationId, setConversationId, messages, setMessages } = useSession()
  const { user, signOut } = useAuth()
  const [inputValue, setInputValue] = useState('')
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [username, setUsername] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    async function fetchUserData() {
      if (user?.id) {
        const { data } = await getUser(user.id)
        if (data) {
          setUsername(data.username)
        }
      }
    }
    fetchUserData()
  }, [user])

  const handleUploadPDF = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.pdf')) {
      setUploadStatus('Error: Please upload a PDF file')
      return
    }

    setIsLoading(true)
    setUploadStatus('Uploading PDF...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      // Include conversationId if one exists
      if (conversationId) {
        formData.append('conversationId', conversationId)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload PDF')
      }

      const data = await response.json()
      setSessionId(data.session_id)
      setPdfName(file.name)
      if (data.conversation_id) {
        setConversationId(data.conversation_id)
      }
      setUploadStatus(`PDF uploaded successfully! ${data.chunks_count} chunks created.`)
      
      // Reload messages from database to get the system message
      if (data.conversation_id) {
        try {
          const { getChatMessages } = await import('@/lib/supabase/database')
          const { data: dbMessages } = await getChatMessages(data.conversation_id)
          if (dbMessages && dbMessages.length > 0) {
            const formattedMessages = dbMessages.map(msg => ({
              id: msg.id,
              author: msg.author === 'user' ? 'You' : msg.author === 'assistant' ? 'FasarliAI' : msg.author === 'system' ? 'System' : msg.author,
              avatar: msg.author === 'user' ? 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar-user.jpg' : msg.author === 'assistant' ? '⚡' : '',
              timestamp: new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              content: msg.content,
              sources: msg.sources,
            }))
            setMessages(formattedMessages)
          }
        } catch (error) {
          console.error('Error loading messages:', error)
        }
        
        // Generate conversation name based on PDF content
        if (data.session_id && data.conversation_id) {
          setTimeout(async () => {
            try {
              const nameResponse = await fetch('/api/conversations/generate-name-from-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  sessionId: data.session_id,
                  conversationId: data.conversation_id 
                }),
              })

              if (nameResponse.ok) {
                const { name } = await nameResponse.json()
                
                // Update conversation title
                await fetch('/api/conversations/rename', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    conversationId: data.conversation_id,
                    title: name,
                  }),
                })

                // Refresh conversations list
                window.dispatchEvent(new Event('conversation-created'))
              }
            } catch (error) {
              console.error('Error generating conversation name:', error)
            }
          }, 2000) // Wait 2 seconds for PDF processing to complete
        }
      }
      
      // Trigger a page refresh to reload conversations list
      window.dispatchEvent(new Event('conversation-created'))
    } catch (error) {
      setUploadStatus(`Error: ${error instanceof Error ? error.message : 'Failed to upload PDF'}`)
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    
    // If no conversation exists, create one
    let currentConversationId = conversationId
    if (!currentConversationId && user?.id) {
      try {
        const title = `Chat ${new Date().toLocaleDateString()}`
        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title }),
        })

        if (response.ok) {
          const { conversation } = await response.json()
          currentConversationId = conversation.id
          setConversationId(conversation.id)
          window.dispatchEvent(new Event('conversation-created'))
        }
      } catch (error) {
        console.error('Error creating conversation:', error)
        toast.error('Failed to create conversation')
      }
    }

    // If no session ID, we can still create a conversation but can't chat without PDF
    if (!sessionId) {
      setUploadStatus('Please upload a PDF first to start chatting')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      author: 'You',
      avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar-user.jpg',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      content: inputValue,
    }

    setMessages((prev: Message[]) => [...prev, userMessage])
    const questionText = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: questionText,
          sessionId: sessionId,
          conversationId: currentConversationId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get response')
      }

      const data = await response.json()
      
      // Create placeholder bot message with empty content
      const botMessageId = data.id || Date.now().toString()
      const botMessage: Message = {
        id: botMessageId,
        author: data.author || 'FasarliAI',
        avatar: '⚡',
        timestamp: data.timestamp,
        content: '',
        sources: data.sources,
      }

      // Add empty message first
      setMessages((prev: Message[]) => [...prev, botMessage])

      // Animate typing effect character by character
      const fullContent = data.content
      let currentIndex = 0

      const typeCharacter = () => {
        if (currentIndex < fullContent.length) {
          const currentContent = fullContent.substring(0, currentIndex + 1)
          setMessages((prev: Message[]) => prev.map((msg: Message) => 
            msg.id === botMessageId 
              ? { ...msg, content: currentContent }
              : msg
          ))
          currentIndex++
          // 30ms delay per character for smooth typing effect
          setTimeout(typeCharacter, 30)
        } else {
          // Typing complete
          setIsLoading(false)
        }
      }

      // Start typing effect
      typeCharacter()
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        author: 'System',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
      }
      setMessages((prev: Message[]) => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background border-l border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          {!sidebarOpen && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleSidebar}
              className="text-foreground"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <span className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            ✨ FasarliAI
          </span>
        </div>
        <div className="flex items-center gap-3 relative">
          <Button variant="ghost" size="icon" className="text-foreground">
            <Sun className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground">
            <Moon className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400" />
          
          <div ref={settingsRef} className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-foreground"
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            >
              <Settings className="w-5 h-5" />
            </Button>
            
            {showSettingsMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="py-2">
                  {username && (
                    <div className="px-4 py-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{username}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{user?.email}</div>
                    </div>
                  )}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-4 py-2 text-foreground hover:bg-muted rounded-none"
                    onClick={signOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && !sessionId ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold">Upload a PDF to Get Started</h3>
              <p className="text-muted-foreground">
                Upload your PDF document and start asking questions, generating quizzes, and creating flashcards!
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
                size="lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload PDF Document
              </Button>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={msg.id}>
              <MessageBubble 
                author={msg.author}
                avatar={msg.avatar || ''}
                timestamp={msg.timestamp}
                content={msg.content}
              />
              {msg.sources && idx === messages.length - 1 && (
                <div className="mt-4">
                  <SourcesPanel sources={msg.sources} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Upload Status */}
      {uploadStatus && (
        <div className={`px-6 py-2 text-sm ${
          uploadStatus.includes('Error') 
            ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
            : 'text-green-600 bg-green-50 dark:bg-green-900/20'
        }`}>
          {uploadStatus}
        </div>
      )}

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-border bg-card space-y-2">
        <div className="flex gap-3">
          <Input
            placeholder={sessionId ? "Message FasarliAI..." : "Upload a PDF first to start chatting..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            className="flex-1 bg-background border-border"
            disabled={!sessionId || isLoading}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUploadPDF}
            accept=".pdf"
            className="hidden"
          />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            title="Upload PDF"
          >
            <Upload className="w-5 h-5" />
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={!sessionId || isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 disabled:opacity-50"
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {sessionId 
            ? "FasarliAI can make mistakes. Check the answers."
            : "Upload a PDF file to start asking questions about it."}
        </p>
      </div>
    </div>
  )
}
