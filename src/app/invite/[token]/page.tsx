"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    RiTeamFill,
    RiMailCheckLine,
    RiLoader4Line,
    RiErrorWarningLine,
    RiCheckLine
} from "react-icons/ri"
import { toast } from "sonner"
import { useAuth } from "@clerk/nextjs"

interface InvitationDetails {
    email: string
    role: string
    teams: {
        name: string
        slug: string
    }
    created_at: string
    expires_at: string
}

export default function AcceptInvitationPage() {
    const params = useParams()
    const router = useRouter()
    const { isSignedIn, isLoaded } = useAuth()
    const token = params.token as string

    const [invitation, setInvitation] = useState<InvitationDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAccepting, setIsAccepting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isLoaded) {
            loadInvitation()
        }
    }, [token, isLoaded])

    const loadInvitation = async () => {
        try {
            const res = await fetch(`/api/teams/accept-invitation?token=${token}`)
            if (res.ok) {
                const data = await res.json()
                setInvitation(data)
            } else {
                const error = await res.json()
                setError(error.error || 'Invalid invitation')
            }
        } catch (err) {
            setError('Failed to load invitation')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAccept = async () => {
        if (!isSignedIn) {
            toast.error('Please sign in to accept this invitation')
            router.push(`/sign-in?redirect_url=/invite/${token}`)
            return
        }

        setIsAccepting(true)
        const toastId = toast.loading('ACCEPTING_INVITATION...')

        try {
            const res = await fetch('/api/teams/accept-invitation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            })

            if (res.ok) {
                const data = await res.json()
                toast.success(`JOINED_TEAM: ${data.team.name}`, { id: toastId })
                router.push(`/dashboard/teams/${data.team.id}`)
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to accept invitation', { id: toastId })
            }
        } catch (error) {
            toast.error('Network error', { id: toastId })
        } finally {
            setIsAccepting(false)
        }
    }

    if (isLoading || !isLoaded) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <RiLoader4Line className="w-8 h-8 text-primary animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full border-4 border-red-500 bg-black p-8 text-center"
                >
                    <div className="w-20 h-20 border-4 border-red-500 bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                        <RiErrorWarningLine className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-heading font-black uppercase mb-4 text-red-500">INVALID_INVITATION</h1>
                    <p className="text-sm font-black text-white/60 uppercase mb-8">{error}</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full px-6 py-3 border-2 border-white/20 font-black text-[10px] uppercase hover:bg-white/5 transition-all"
                    >
                        RETURN_TO_DASHBOARD
                    </button>
                </motion.div>
            </div>
        )
    }

    if (!invitation) {
        return null
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full border-4 border-primary bg-black p-8 shadow-[12px_12px_0px_rgba(204,255,0,0.3)]"
            >
                {/* Icon */}
                <div className="w-20 h-20 border-4 border-primary bg-primary/10 flex items-center justify-center mx-auto mb-8">
                    <RiMailCheckLine className="w-10 h-10 text-primary" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-heading font-black uppercase text-center mb-2">TEAM_INVITATION</h1>
                <p className="text-[10px] font-black text-white/40 uppercase text-center mb-8">
                    You&apos;ve been invited to join a workspace
                </p>

                {/* Invitation Details */}
                <div className="space-y-6 mb-8">
                    <div className="p-6 border-2 border-white/10 bg-white/[0.02]">
                        <div className="text-[10px] font-black uppercase text-primary mb-3">WORKSPACE</div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 border-4 border-primary bg-primary/10 flex items-center justify-center">
                                <RiTeamFill className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-black uppercase">{invitation.teams.name}</div>
                                <div className="text-[10px] font-mono text-white/40">@{invitation.teams.slug}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border-2 border-white/10 bg-white/[0.02]">
                            <div className="text-[8px] font-black uppercase text-white/40 mb-2">YOUR_ROLE</div>
                            <div className={`px-3 py-1.5 text-[10px] font-black uppercase inline-block border ${invitation.role === 'admin' ? 'bg-blue-500/20 text-blue-400 border-blue-500' :
                                invitation.role === 'developer' ? 'bg-purple-500/20 text-purple-400 border-purple-500' :
                                    'bg-white/10 text-white/60 border-white/20'
                                }`}>
                                {invitation.role}
                            </div>
                        </div>

                        <div className="p-4 border-2 border-white/10 bg-white/[0.02]">
                            <div className="text-[8px] font-black uppercase text-white/40 mb-2">INVITED_TO</div>
                            <div className="text-xs font-mono text-white/60">{invitation.email}</div>
                        </div>
                    </div>

                    <div className="p-4 border-2 border-yellow-500/20 bg-yellow-500/5">
                        <div className="text-[8px] font-black uppercase text-yellow-500 mb-2">EXPIRES</div>
                        <div className="text-xs font-black text-white/60 uppercase">
                            {new Date(invitation.expires_at).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Permissions Info */}
                <div className="p-6 border-2 border-primary/20 bg-primary/5 mb-8">
                    <div className="text-[10px] font-black uppercase text-primary mb-3">
                        AS_{invitation.role.toUpperCase()}_YOU_CAN:
                    </div>
                    <ul className="space-y-2 text-[10px] font-black text-white/60 uppercase">
                        {invitation.role === 'admin' && (
                            <>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine className="w-4 h-4 text-primary" />
                                    Create and manage agents
                                </li>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine className="w-4 h-4 text-primary" />
                                    Invite and remove team members
                                </li>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine className="w-4 h-4 text-primary" />
                                    Manage API keys and webhooks
                                </li>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine className="w-4 h-4 text-primary" />
                                    View team analytics
                                </li>
                            </>
                        )}
                        {invitation.role === 'developer' && (
                            <>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine className="w-4 h-4 text-primary" />
                                    Create and edit agents
                                </li>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine className="w-4 h-4 text-primary" />
                                    Create API keys and webhooks
                                </li>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine className="w-4 h-4 text-primary" />
                                    View team analytics
                                </li>
                            </>
                        )}
                        {invitation.role === 'viewer' && (
                            <>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine className="w-4 h-4 text-primary" />
                                    View agents and resources
                                </li>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine className="w-4 h-4 text-primary" />
                                    View team analytics
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Actions */}
                {!isSignedIn ? (
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-white/60 uppercase text-center mb-4">
                            Sign in to accept this invitation
                        </p>
                        <button
                            onClick={() => router.push(`/sign-in?redirect_url=/invite/${token}`)}
                            className="w-full px-6 py-4 bg-primary text-black font-black text-[10px] uppercase hover:bg-white transition-all"
                        >
                            SIGN_IN_TO_ACCEPT
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAccept}
                        disabled={isAccepting}
                        className="w-full px-6 py-4 bg-primary text-black font-black text-[10px] uppercase hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isAccepting ? (
                            <>
                                <RiLoader4Line className="w-4 h-4 animate-spin" />
                                ACCEPTING...
                            </>
                        ) : (
                            <>
                                <RiCheckLine className="w-4 h-4" />
                                ACCEPT_INVITATION
                            </>
                        )}
                    </button>
                )}

                {/* Footer */}
                <p className="text-[8px] font-black text-white/30 uppercase text-center mt-6">
                    By accepting, you agree to join {invitation.teams.name} as a {invitation.role}
                </p>
            </motion.div>
        </div>
    )
}
