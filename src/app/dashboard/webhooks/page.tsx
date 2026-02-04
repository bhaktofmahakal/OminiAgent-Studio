"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    RiWebhookLine,
    RiAddLine,
    RiDeleteBin6Line,
    RiTestTubeLine,
    RiHistoryLine,
    RiCheckLine,
    RiCloseLine,
    RiLoader4Line,
    RiEyeLine,
    RiSettings4Line,
    RiFlashlightFill
} from "react-icons/ri"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Webhook {
    id: string
    name: string
    url: string
    events: string[]
    is_active: boolean
    agent_id: string | null
    agents?: { name: string }
    created_at: string
    secret: string
}

interface WebhookLog {
    id: string
    event_type: string
    status: 'success' | 'failed' | 'retrying'
    status_code: number | null
    created_at: string
    attempt_number: number
}

const EVENT_TYPES = [
    { value: 'chat.started', label: 'Chat Started', desc: 'When a new chat begins' },
    { value: 'chat.completed', label: 'Chat Completed', desc: 'When a chat interaction finishes' },
    { value: 'tool.executed', label: 'Tool Executed', desc: 'When an agent uses a tool' },
    { value: 'approval.requested', label: 'Approval Requested', desc: 'When HITL approval is needed' },
    { value: 'approval.granted', label: 'Approval Granted', desc: 'When user approves an action' },
    { value: 'approval.denied', label: 'Approval Denied', desc: 'When user denies an action' },
    { value: 'memory.stored', label: 'Memory Stored', desc: 'When a fact is memorized' },
    { value: 'document.uploaded', label: 'Document Uploaded', desc: 'When RAG document is added' },
    { value: 'error.occurred', label: 'Error Occurred', desc: 'When an error happens' },
]

export default function WebhooksPage() {
    const [webhooks, setWebhooks] = useState<Webhook[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null)
    const [logs, setLogs] = useState<WebhookLog[]>([])
    const [showLogs, setShowLogs] = useState(false)

    // Form state
    const [formName, setFormName] = useState("")
    const [formUrl, setFormUrl] = useState("")
    const [formEvents, setFormEvents] = useState<string[]>([])

    useEffect(() => {
        loadWebhooks()
    }, [])

    const loadWebhooks = async () => {
        try {
            const res = await fetch('/api/webhooks')
            if (res.ok) {
                const data = await res.json()
                setWebhooks(data)
            }
        } catch (error) {
            toast.error('Failed to load webhooks')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreate = async () => {
        if (!formName || !formUrl || formEvents.length === 0) {
            toast.error('Please fill all required fields')
            return
        }

        try {
            const res = await fetch('/api/webhooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formName,
                    url: formUrl,
                    events: formEvents
                })
            })

            if (res.ok) {
                toast.success('Webhook created successfully!')
                setShowCreateDialog(false)
                setFormName("")
                setFormUrl("")
                setFormEvents([])
                loadWebhooks()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to create webhook')
            }
        } catch (error) {
            toast.error('Network error')
        }
    }

    const handleDelete = async (id: string, name: string) => {
        toast.error(`DELETE_WEBHOOK: ${name}`, {
            description: 'This action cannot be undone',
            action: {
                label: 'CONFIRM',
                onClick: async () => {
                    const res = await fetch(`/api/webhooks/${id}`, { method: 'DELETE' })
                    if (res.ok) {
                        toast.success('Webhook deleted')
                        loadWebhooks()
                    }
                }
            }
        })
    }

    const handleToggle = async (id: string, currentState: boolean) => {
        try {
            const res = await fetch(`/api/webhooks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !currentState })
            })

            if (res.ok) {
                toast.success(currentState ? 'Webhook disabled' : 'Webhook enabled')
                loadWebhooks()
            }
        } catch (error) {
            toast.error('Failed to update webhook')
        }
    }

    const handleTest = async (id: string, name: string) => {
        const toastId = toast.loading(`Testing webhook: ${name}...`)

        try {
            const res = await fetch(`/api/webhooks/${id}/test`, { method: 'POST' })
            const data = await res.json()

            if (data.success) {
                toast.success('Test webhook sent!', { id: toastId })
            } else {
                toast.error('Test failed', { id: toastId })
            }
        } catch (error) {
            toast.error('Test failed', { id: toastId })
        }
    }

    const handleViewLogs = async (webhook: Webhook) => {
        setSelectedWebhook(webhook)
        setShowLogs(true)

        try {
            const res = await fetch(`/api/webhooks/${webhook.id}/logs`)
            if (res.ok) {
                const data = await res.json()
                setLogs(data)
            }
        } catch (error) {
            toast.error('Failed to load logs')
        }
    }

    const toggleEvent = (event: string) => {
        if (formEvents.includes(event)) {
            setFormEvents(formEvents.filter(e => e !== event))
        } else {
            setFormEvents([...formEvents, event])
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <RiLoader4Line className="w-8 h-8 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b-4 border-white/10 bg-black/60 backdrop-blur-sm sticky top-0 z-40">
                <div className="container mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 border-4 border-primary bg-primary/10 flex items-center justify-center">
                                <RiWebhookLine className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-heading font-black uppercase tracking-tight">WEBHOOKS</h1>
                                <p className="text-[10px] font-black text-white/40 uppercase">Real-Time_Event_Integration</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCreateDialog(true)}
                            className="px-6 py-3 bg-primary text-black font-black text-[10px] uppercase hover:bg-white transition-all flex items-center gap-2"
                        >
                            <RiAddLine className="w-4 h-4" /> CREATE_WEBHOOK
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-8 py-12">
                {webhooks.length === 0 ? (
                    <div className="text-center py-20">
                        <RiWebhookLine className="w-16 h-16 text-white/10 mx-auto mb-4" />
                        <p className="text-white/40 font-black uppercase text-sm">NO_WEBHOOKS_CONFIGURED</p>
                        <p className="text-white/20 font-black uppercase text-[10px] mt-2">Create your first webhook to get started</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {webhooks.map((webhook) => (
                            <motion.div
                                key={webhook.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border-4 border-white/10 bg-white/[0.02] p-6 hover:border-primary/40 transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-2">
                                            <h3 className="text-xl font-heading font-black uppercase">{webhook.name}</h3>
                                            <Switch
                                                checked={webhook.is_active}
                                                onCheckedChange={() => handleToggle(webhook.id, webhook.is_active)}
                                                className="data-[state=checked]:bg-primary"
                                            />
                                        </div>
                                        <p className="text-[10px] font-mono text-white/60 mb-4 break-all">{webhook.url}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {webhook.events.map((event) => (
                                                <span
                                                    key={event}
                                                    className="px-2 py-1 bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase"
                                                >
                                                    {event}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleTest(webhook.id, webhook.name)}
                                            className="p-2 border-2 border-white/10 hover:border-primary hover:bg-primary/10 transition-all"
                                            title="Test Webhook"
                                        >
                                            <RiTestTubeLine className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleViewLogs(webhook)}
                                            className="p-2 border-2 border-white/10 hover:border-primary hover:bg-primary/10 transition-all"
                                            title="View Logs"
                                        >
                                            <RiHistoryLine className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(webhook.id, webhook.name)}
                                            className="p-2 border-2 border-white/10 hover:border-red-500 hover:bg-red-500/10 transition-all"
                                            title="Delete"
                                        >
                                            <RiDeleteBin6Line className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Dialog */}
            <AnimatePresence>
                {showCreateDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                        onClick={() => setShowCreateDialog(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-black border-4 border-primary p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-2xl font-heading font-black uppercase mb-6">CREATE_WEBHOOK</h2>

                            <div className="space-y-6">
                                <div>
                                    <Label className="text-[10px] font-black uppercase text-primary">Webhook Name</Label>
                                    <Input
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        placeholder="My Slack Notification"
                                        className="mt-2 bg-black border-white/20 text-white"
                                    />
                                </div>

                                <div>
                                    <Label className="text-[10px] font-black uppercase text-primary">Endpoint URL</Label>
                                    <Input
                                        value={formUrl}
                                        onChange={(e) => setFormUrl(e.target.value)}
                                        placeholder="https://hooks.slack.com/services/..."
                                        className="mt-2 bg-black border-white/20 text-white font-mono text-xs"
                                    />
                                </div>

                                <div>
                                    <Label className="text-[10px] font-black uppercase text-primary mb-4 block">Event Types</Label>
                                    <div className="grid gap-2">
                                        {EVENT_TYPES.map((event) => (
                                            <div
                                                key={event.value}
                                                onClick={() => toggleEvent(event.value)}
                                                className={`p-4 border-2 cursor-pointer transition-all ${formEvents.includes(event.value)
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-xs font-black uppercase">{event.label}</div>
                                                        <div className="text-[8px] text-white/40 uppercase mt-1">{event.desc}</div>
                                                    </div>
                                                    {formEvents.includes(event.value) && (
                                                        <RiCheckLine className="w-5 h-5 text-primary" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setShowCreateDialog(false)}
                                    className="flex-1 px-6 py-3 border-2 border-white/20 font-black text-[10px] uppercase hover:bg-white/5 transition-all"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="flex-1 px-6 py-3 bg-primary text-black font-black text-[10px] uppercase hover:bg-white transition-all"
                                >
                                    CREATE
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Logs Dialog */}
            <AnimatePresence>
                {showLogs && selectedWebhook && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                        onClick={() => setShowLogs(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-black border-4 border-primary p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-2xl font-heading font-black uppercase mb-6">DELIVERY_LOGS: {selectedWebhook.name}</h2>

                            {logs.length === 0 ? (
                                <p className="text-white/40 text-center py-8 font-black uppercase text-sm">NO_DELIVERIES_YET</p>
                            ) : (
                                <div className="space-y-2">
                                    {logs.map((log) => (
                                        <div
                                            key={log.id}
                                            className={`p-4 border-2 ${log.status === 'success'
                                                    ? 'border-green-500/20 bg-green-500/5'
                                                    : log.status === 'retrying'
                                                        ? 'border-yellow-500/20 bg-yellow-500/5'
                                                        : 'border-red-500/20 bg-red-500/5'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {log.status === 'success' ? (
                                                        <RiCheckLine className="w-5 h-5 text-green-500" />
                                                    ) : log.status === 'retrying' ? (
                                                        <RiLoader4Line className="w-5 h-5 text-yellow-500 animate-spin" />
                                                    ) : (
                                                        <RiCloseLine className="w-5 h-5 text-red-500" />
                                                    )}
                                                    <div>
                                                        <div className="text-xs font-black uppercase">{log.event_type}</div>
                                                        <div className="text-[8px] text-white/40 uppercase">
                                                            {new Date(log.created_at).toLocaleString()} • Attempt {log.attempt_number}
                                                        </div>
                                                    </div>
                                                </div>
                                                {log.status_code && (
                                                    <span className="text-[10px] font-mono font-black text-white/60">
                                                        HTTP {log.status_code}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => setShowLogs(false)}
                                className="w-full mt-6 px-6 py-3 border-2 border-white/20 font-black text-[10px] uppercase hover:bg-white/5 transition-all"
                            >
                                CLOSE
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
