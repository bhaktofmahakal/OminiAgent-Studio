'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

interface Agent {
    name: string
    description: string
    model: string
    visibility: string
}

export default function EmbedAgentPage() {
    const params = useParams()
    const agentId = params.id as string

    const [agent, setAgent] = useState<Agent | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isAgentLoading, setIsAgentLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        async function loadAgent() {
            try {
                const response = await fetch(`/api/agent/${agentId}`)
                if (!response.ok) throw new Error('Agent not found')
                const data = await response.json()
                setAgent(data)
                setMessages([{
                    role: 'assistant',
                    content: `Hi! I'm ${data.name}. ${data.description || 'How can I help you?'}`
                }])
            } catch (err) {
                setError('Failed to load agent')
            } finally {
                setIsAgentLoading(false)
            }
        }
        if (agentId) loadAgent()
    }, [agentId])

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const response = await fetch(`/api/agent/${agentId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.content })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Failed to get response')

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.message
            }])
        } catch (err) {
            console.error(err)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }])
        } finally {
            setIsLoading(false)
        }
    }

    if (isAgentLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !agent) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background p-4 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h1 className="text-xl font-bold mb-2">Unavailable</h1>
                <p className="text-muted-foreground">{error || 'Agent not found'}</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <div className="flex items-center p-4 border-b bg-card">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="font-semibold text-lg leading-none">{agent.name}</h1>
                    <p className="text-xs text-muted-foreground mt-1">Powered by OmniAgent</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex w-full",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                                msg.role === 'user'
                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                    : "bg-muted text-foreground rounded-bl-none"
                            )}
                        >
                            <div className="prose prose-sm dark:prose-invert max-w-none break-words text-inherit">
                                <ReactMarkdown>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce delay-75" />
                                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce delay-150" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-card">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
