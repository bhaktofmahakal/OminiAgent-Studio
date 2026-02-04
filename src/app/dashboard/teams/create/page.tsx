"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { RiTeamFill, RiArrowLeftLine, RiLoader4Line } from "react-icons/ri"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"

export default function CreateTeamPage() {
    const router = useRouter()
    const [teamName, setTeamName] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    const handleCreate = async () => {
        if (!teamName.trim() || teamName.trim().length < 3) {
            toast.error('Team name must be at least 3 characters')
            return
        }

        setIsCreating(true)
        const toastId = toast.loading('CREATING_WORKSPACE...')

        try {
            const res = await fetch('/api/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: teamName.trim() })
            })

            if (res.ok) {
                const team = await res.json()
                toast.success(`WORKSPACE_CREATED: ${team.name}`, { id: toastId })
                router.push(`/dashboard/teams/${team.id}`)
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to create team', { id: toastId })
            }
        } catch (error) {
            toast.error('Network error', { id: toastId })
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b-4 border-white/10 bg-black/60 backdrop-blur-sm">
                <div className="container mx-auto px-8 py-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="w-12 h-12 border-4 border-white/10 flex items-center justify-center hover:border-primary transition-all"
                        >
                            <RiArrowLeftLine className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-heading font-black uppercase tracking-tight">CREATE_WORKSPACE</h1>
                            <p className="text-[10px] font-black text-white/40 uppercase">Initialize_New_Team_Environment</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-8 py-12">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-4 border-primary bg-black p-8 shadow-[12px_12px_0px_rgba(204,255,0,0.3)]"
                    >
                        {/* Icon */}
                        <div className="w-20 h-20 border-4 border-primary bg-primary/10 flex items-center justify-center mb-8">
                            <RiTeamFill className="w-10 h-10 text-primary" />
                        </div>

                        {/* Form */}
                        <div className="space-y-8">
                            <div>
                                <Label className="text-[10px] font-black uppercase text-primary mb-3 block">
                                    WORKSPACE_NAME *
                                </Label>
                                <Input
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    placeholder="My AI Startup"
                                    className="bg-black border-2 border-white/20 text-white font-black text-lg h-14 focus:border-primary"
                                    disabled={isCreating}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !isCreating) {
                                            handleCreate()
                                        }
                                    }}
                                />
                                <p className="text-[8px] font-black text-white/40 uppercase mt-2">
                                    Choose a name for your team workspace. You can change this later.
                                </p>
                            </div>

                            {/* Info Cards */}
                            <div className="grid gap-4">
                                <div className="p-4 border-2 border-white/10 bg-white/[0.02]">
                                    <div className="text-[10px] font-black uppercase text-primary mb-2">WHAT_YOU_GET</div>
                                    <ul className="space-y-2 text-[10px] font-black text-white/60 uppercase">
                                        <li>• Collaborative agent development</li>
                                        <li>• Role-based access control</li>
                                        <li>• Shared API keys & webhooks</li>
                                        <li>• Team analytics & insights</li>
                                        <li>• Invite unlimited members</li>
                                    </ul>
                                </div>

                                <div className="p-4 border-2 border-primary/20 bg-primary/5">
                                    <div className="text-[10px] font-black uppercase text-primary mb-2">FREE_TIER_INCLUDES</div>
                                    <ul className="space-y-2 text-[10px] font-black text-white/60 uppercase">
                                        <li>• Up to 5 team members</li>
                                        <li>• 10,000 tokens/month</li>
                                        <li>• Basic analytics</li>
                                        <li>• Community support</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <Link
                                    href="/dashboard"
                                    className="flex-1 px-6 py-4 border-2 border-white/20 font-black text-[10px] uppercase hover:bg-white/5 transition-all text-center"
                                >
                                    CANCEL
                                </Link>
                                <button
                                    onClick={handleCreate}
                                    disabled={isCreating || teamName.trim().length < 3}
                                    className="flex-1 px-6 py-4 bg-primary text-black font-black text-[10px] uppercase hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isCreating ? (
                                        <>
                                            <RiLoader4Line className="w-4 h-4 animate-spin" />
                                            CREATING...
                                        </>
                                    ) : (
                                        'CREATE_WORKSPACE'
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Additional Info */}
                    <div className="mt-8 p-6 border-2 border-white/10 bg-white/[0.02]">
                        <div className="text-[10px] font-black uppercase text-white/40 mb-3">IMPORTANT_NOTES</div>
                        <ul className="space-y-2 text-[9px] font-black text-white/30 uppercase">
                            <li>• You will be the workspace owner with full permissions</li>
                            <li>• You can invite team members after creation</li>
                            <li>• Workspace slug will be auto-generated from the name</li>
                            <li>• You can upgrade to Pro or Enterprise plans later</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
