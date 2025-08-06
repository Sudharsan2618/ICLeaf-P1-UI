"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User, UserRole } from "@/app/page"
import { GraduationCap, Users, Shield } from "lucide-react"

interface LoginPageProps {
  onLogin: (user: User) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("learner")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      role: selectedRole,
    }

    onLogin(user)
  }

  const roleIcons = {
    trainer: <GraduationCap className="h-5 w-5" />,
    learner: <Users className="h-5 w-5" />,
    admin: <Shield className="h-5 w-5" />,
  }

  const roleDescriptions = {
    trainer: "Create and manage course content",
    learner: "Access learning materials and assessments",
    admin: "Full system administration access",
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-slate-800">Welcome Back</CardTitle>
          <CardDescription className="text-slate-600">Sign in to access your learning platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-slate-200 focus:border-orange-300 focus:ring-orange-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-700">
                Role
              </Label>
              <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                <SelectTrigger className="border-slate-200 focus:border-orange-300 focus:ring-orange-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleDescriptions).map(([role, description]) => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        {roleIcons[role as UserRole]}
                        <div>
                          <div className="font-medium capitalize">{role}</div>
                          <div className="text-xs text-slate-500">{description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={!name.trim()}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
