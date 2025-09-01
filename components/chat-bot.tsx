"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/app/page"
import { Send, Bot, UserIcon, Loader2, Globe, Youtube, GitBranch, ExternalLink, Calendar, User as UserIcon2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface ChatBotProps {
  user: User
  chatMode: "internal" | "external"
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  visualizations?: {
    web?: WebResult[]
    youtube?: YouTubeResult[]
    git?: GitResult[]
  }
}

interface WebResult {
  title: string
  url: string
  snippet: string
  source?: string
  link?: string
  description?: string
}

interface YouTubeResult {
  title: string
  url: string
  channel: string
  duration: string
  views: string
  publishedAt: string
  thumbnail?: string
  snippet?: string
  link?: string
  author?: string
  date?: string
}

interface GitResult {
  title: string
  url: string
  description: string
  language: string
  stars: number
  forks: number
  updatedAt: string
  author: string
  name?: string
  snippet?: string
  link?: string
  stargazers_count?: number
  forks_count?: number
  updated_at?: string
  owner?: string
}

interface BackendResponse {
  response: string | {
    answer?: string
    web_results?: WebResult[]
    youtube_results?: YouTubeResult[]
    git_results?: GitResult[]
    web?: WebResult[]
    youtube?: YouTubeResult[]
    git?: GitResult[]
  }
}

// Visualization Components
function WebResults({ results }: { results: WebResult[] }) {
  if (!results || results.length === 0) return null

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <Globe className="h-4 w-4 text-blue-600" />
        Web Results
      </div>
      <div className="space-y-3">
        {results.map((result, index) => (
          <Card key={index} className="bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-700 hover:text-blue-800 line-clamp-2"
                  >
                    {result.title}
                  </a>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{result.snippet}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500">{result.url}</span>
                    {result.source && (
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        {result.source}
                      </Badge>
                    )}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function YouTubeResults({ results }: { results: YouTubeResult[] }) {
  if (!results || results.length === 0) return null

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <Youtube className="h-4 w-4 text-red-600" />
        YouTube Results
      </div>
      <div className="space-y-3">
        {results.map((result, index) => (
          <Card key={index} className="bg-red-50 border-red-200 hover:bg-red-100 transition-colors">
            <CardContent className="p-3">
              <div className="flex gap-3">
                {result.thumbnail && (
                  <div className="w-20 h-12 bg-slate-200 rounded flex-shrink-0 flex items-center justify-center">
                    <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover rounded" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-red-700 hover:text-red-800 line-clamp-2"
                  >
                    {result.title}
                  </a>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-600">{result.channel}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">{result.views} views</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">{result.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-500">{result.publishedAt}</span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function GitResults({ results }: { results: GitResult[] }) {
  if (!results || results.length === 0) return null

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <GitBranch className="h-4 w-4 text-purple-600" />
        Git Repository Results
      </div>
      <div className="space-y-3">
        {results.map((result, index) => (
          <Card key={index} className="bg-purple-50 border-purple-200 hover:bg-purple-100 transition-colors">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-purple-700 hover:text-purple-800 line-clamp-2"
                  >
                    {result.title}
                  </a>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{result.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <UserIcon2 className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{result.author}</span>
                    </div>
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      {result.language}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">⭐ {result.stars}</span>
                      <span className="text-xs text-slate-500">🍴 {result.forks}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-500">Updated {result.updatedAt}</span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ChatBot({ user, chatMode }: ChatBotProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const parseVisualizations = (data: BackendResponse['response']) => {
    const visualizations: {
      web?: WebResult[]
      youtube?: YouTubeResult[]
      git?: GitResult[]
    } = {}
    
    if (typeof data === 'object' && data !== null) {
      // Parse web results
      if (data.web_results && Array.isArray(data.web_results)) {
        visualizations.web = data.web_results.map((result: WebResult) => ({
          title: result.title || result.snippet?.substring(0, 50) + '...',
          url: result.url || result.link || '',
          snippet: result.snippet || result.description || '',
          source: result.source || 'Web'
        }))
      }
      
      // Parse YouTube results
      if (data.youtube_results && Array.isArray(data.youtube_results)) {
        visualizations.youtube = data.youtube_results.map((result: YouTubeResult) => ({
          title: result.title || result.snippet?.substring(0, 50) + '...',
          url: result.url || result.link || '',
          channel: result.channel || result.author || 'Unknown Channel',
          duration: result.duration || 'Unknown',
          views: result.views || 'Unknown views',
          publishedAt: result.publishedAt || result.date || 'Unknown date',
          thumbnail: result.thumbnail
        }))
      }
      
      // Parse Git results
      if (data.git_results && Array.isArray(data.git_results)) {
        visualizations.git = data.git_results.map((result: GitResult) => ({
          title: result.title || result.name || result.snippet?.substring(0, 50) + '...',
          url: result.url || result.link || '',
          description: result.description || result.snippet || '',
          language: result.language || 'Unknown',
          stars: result.stars || result.stargazers_count || 0,
          forks: result.forks || result.forks_count || 0,
          updatedAt: result.updatedAt || result.updated_at || 'Unknown',
          author: result.author || result.owner || 'Unknown'
        }))
      }
      
      // Also check for alternative field names
      if (data.web && Array.isArray(data.web)) {
        visualizations.web = data.web.map((result: WebResult) => ({
          title: result.title || result.snippet?.substring(0, 50) + '...',
          url: result.url || result.link || '',
          snippet: result.snippet || result.description || '',
          source: result.source || 'Web'
        }))
      }
      
      if (data.youtube && Array.isArray(data.youtube)) {
        visualizations.youtube = data.youtube.map((result: YouTubeResult) => ({
          title: result.title || result.snippet?.substring(0, 50) + '...',
          url: result.url || result.link || '',
          channel: result.channel || result.author || 'Unknown Channel',
          duration: result.duration || 'Unknown',
          views: result.views || 'Unknown views',
          publishedAt: result.publishedAt || result.date || 'Unknown date',
          thumbnail: result.thumbnail
        }))
      }
      
      if (data.git && Array.isArray(data.git)) {
        visualizations.git = data.git.map((result: GitResult) => ({
          title: result.title || result.name || result.snippet?.substring(0, 50) + '...',
          url: result.url || result.link || '',
          description: result.description || result.snippet || '',
          language: result.language || 'Unknown',
          stars: result.stars || result.stargazers_count || 0,
          forks: result.forks || result.forks_count || 0,
          updatedAt: result.updatedAt || result.updated_at || 'Unknown',
          author: result.author || result.owner || 'Unknown'
        }))
      }
    }
    
    return Object.keys(visualizations).length > 0 ? visualizations : undefined
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return

    // Add user message
    const userMsg: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmed,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("https://icleaf-p1-204519078454.europe-west1.run.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: user.role,
          mode: chatMode,
          query: trimmed,
        }),
      })
      if (!res.ok) throw new Error("Failed to fetch response")
      const data: BackendResponse = await res.json()
      console.log('Chat response:', data)
      
      let answer = ""
      let visualizations = undefined
      
      if (chatMode === "external") {
        // Sometimes response is a stringified JSON
        if (typeof data.response === "string") {
          try {
            const parsed = JSON.parse(data.response)
            answer = parsed.answer || data.response
            visualizations = parseVisualizations(parsed)
          } catch {
            answer = data.response
          }
        } else if (typeof data.response === "object" && data.response.answer) {
          answer = data.response.answer
          visualizations = parseVisualizations(data.response)
        } else {
          answer = JSON.stringify(data.response)
          visualizations = parseVisualizations(data.response)
        }
      } else {
        // internal mode: response is an object
        if (typeof data.response === "object" && data.response.answer) {
          answer = data.response.answer
          visualizations = parseVisualizations(data.response)
        } else if (typeof data.response === "string") {
          answer = data.response
        } else {
          answer = JSON.stringify(data.response)
          visualizations = parseVisualizations(data.response)
        }
      }
      
      const botMsg: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: answer,
        visualizations
      }
      setMessages((prev) => [...prev, botMsg])
    } catch (error: unknown) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          content: "Sorry, I couldn&apos;t get a response. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm h-full flex flex-col">
      <CardHeader className="border-b border-slate-200 flex-shrink-0 px-6 py-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-orange-600" />
          Learning Assistant
          <span className="text-sm font-normal text-slate-500">({chatMode} mode)</span>
        </CardTitle>
      </CardHeader>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div 
          className="flex-1 overflow-y-auto px-6 py-4 chat-scroll" 
          ref={scrollAreaRef}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 #f1f5f9',
            maxHeight: 'calc(100vh - 200px)'
          }}
        >
          <div className="space-y-4 pb-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-2">Hello {user.name}! I&apos;m your learning assistant.</p>
                <p className="text-sm text-slate-400">
                  Currently in {chatMode} mode for {user.role} access level.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user" ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {message.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Render visualizations for assistant messages */}
                    {message.role === "assistant" && message.visualizations && (
                      <div className="mt-3 space-y-4">
                        {message.visualizations.web && <WebResults results={message.visualizations.web} />}
                        {message.visualizations.youtube && <YouTubeResults results={message.visualizations.youtube} />}
                        {message.visualizations.git && <GitResults results={message.visualizations.git} />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-slate-100 rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-4 flex-shrink-0 bg-white">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything about your learning..."
              className="flex-1 border-slate-200 focus:border-orange-300 focus:ring-orange-200"
              disabled={isLoading}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSubmit(e as React.FormEvent)
                }
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </Card>
  )
}
