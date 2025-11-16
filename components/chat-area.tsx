'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Sun, Moon, Settings, Menu, Upload, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageBubble } from './message-bubble'
import { SourcesPanel } from './sources-panel'
import { useSession } from '@/contexts/session-context'

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
  const { sessionId, setSessionId, pdfName, setPdfName } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>('')
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
      setUploadStatus(`PDF uploaded successfully! ${data.chunks_count} chunks created.`)
      
      // Add system message
      setMessages([{
        id: Date.now().toString(),
        author: 'System',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        content: `PDF "${file.name}" uploaded and processed successfully. You can now ask questions about the document.`,
      }])
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
    if (!sessionId) {
      setUploadStatus('Please upload a PDF first')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      author: 'You',
      avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar-user.jpg',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      content: inputValue,
    }

    setMessages(prev => [...prev, userMessage])
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
      setMessages(prev => [...prev, botMessage])

      // Animate typing effect character by character
      const fullContent = data.content
      let currentIndex = 0

      const typeCharacter = () => {
        if (currentIndex < fullContent.length) {
          const currentContent = fullContent.substring(0, currentIndex + 1)
          setMessages(prev => prev.map(msg => 
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
      setMessages(prev => [...prev, errorMessage])
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
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-4 py-2 text-foreground hover:bg-muted rounded-none"
                  >
                    Login
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-4 py-2 text-foreground hover:bg-muted rounded-none"
                  >
                    Sign Up
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-4 py-2 text-foreground hover:bg-muted rounded-none"
                  >
                    Sign In
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
                avatar={msg.avatar}
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
