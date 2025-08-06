import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, userRole, chatMode, userName } = await req.json()

  // Role-based system prompts
  const getSystemPrompt = (role: string, mode: string) => {
    const basePrompt = `You are a helpful learning assistant. The user's name is ${userName} and they have ${role} access level.`

    const rolePrompts = {
      admin: `${basePrompt} As an admin user, you can provide information about:
        - System administration and user management
        - Full access to all course content and analytics
        - Platform configuration and settings
        - Advanced troubleshooting and technical support`,

      trainer: `${basePrompt} As a trainer, you can help with:
        - Course content creation and management
        - Student progress tracking and analytics
        - Assessment and quiz creation
        - Teaching methodologies and best practices
        - Limited administrative functions`,

      learner: `${basePrompt} As a learner, you can get help with:
        - Understanding course materials
        - Study tips and learning strategies
        - Assignment guidance and clarification
        - Progress tracking and goal setting
        - Basic platform navigation`,
    }

    const modeContext =
      mode === "internal"
        ? " You are in internal mode - provide detailed, technical information and internal processes."
        : " You are in external mode - provide general, public-facing information suitable for external users."

    return rolePrompts[role as keyof typeof rolePrompts] + modeContext
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: getSystemPrompt(userRole, chatMode),
    messages,
  })

  return result.toTextStreamResponse()
}
