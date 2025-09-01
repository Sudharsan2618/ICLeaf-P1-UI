"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/app/page"
import { LogOut, MessageCircle, Settings, Globe, Building } from "lucide-react"
import { ChatBot } from "@/components/chat-bot"

interface ChatInterfaceProps {
  user: User
  onLogout: () => void
}

export function ChatInterface({ user, onLogout }: ChatInterfaceProps) {
  const [chatMode, setChatMode] = useState<"internal" | "external">("internal")

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "trainer":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "learner":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  // Safeguards in case persisted user data is missing fields
  const safeRole = typeof user?.role === "string" && user.role ? user.role : "learner"
  const safeName = typeof user?.name === "string" && user.name ? user.name : "User"

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 h-16 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">Learning Assistant</h1>
              <p className="text-sm text-slate-600">AI-powered support system</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className={getRoleBadgeColor(safeRole)}>
              {safeRole.charAt(0).toUpperCase() + safeRole.slice(1)}
            </Badge>
            <span className="text-slate-700 font-medium">{safeName}</span>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-600 hover:text-slate-800">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-4 min-h-0 w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-600" />
                  Chat Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-3 block">Chat Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={chatMode === "internal" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChatMode("internal")}
                      className={
                        chatMode === "internal"
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }
                    >
                      <Building className="h-4 w-4 mr-1" />
                      Internal
                    </Button>
                    <Button
                      variant={chatMode === "external" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChatMode("external")}
                      className={
                        chatMode === "external"
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      External
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Role Permissions</h4>
                  <div className="text-xs text-slate-600 space-y-1">
                    {user.role === "admin" && (
                      <>
                        <div>• Full system access</div>
                        <div>• User management</div>
                        <div>• Content moderation</div>
                      </>
                    )}
                    {user.role === "trainer" && (
                      <>
                        <div>• Course content access</div>
                        <div>• Student progress tracking</div>
                        <div>• Assessment creation</div>
                      </>
                    )}
                    {user.role === "learner" && (
                      <>
                        <div>• Learning materials</div>
                        <div>• Progress tracking</div>
                        <div>• Basic support</div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 h-full overflow-hidden">
            <ChatBot user={user} chatMode={chatMode} />
          </div>
        </div>
      </main>
    </div>
  )
}
