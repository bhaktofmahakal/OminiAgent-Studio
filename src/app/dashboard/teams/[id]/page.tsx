"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    RiTeamFill,
    RiUserAddLine,
    RiDeleteBin6Line,
    RiMailLine,
    RiShieldUserLine,
    RiLoader4Line,
    RiArrowLeftLine,
    RiSettings4Line,
    RiCloseLine,
    RiCheckLine
} from "react-icons/ri"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { clerkClient } from "@clerk/nextjs/server"

interface Team {
    id: string
    name: string
    slug: string
    owner_id: string
    plan: string
    role: string
    created_at: string
}

interface Member {
    id: string
    user_id: string
    role: string
    joined_at: string
    email: string
    name: string
    avatar: string | null
}

interface Invitation {
    id: string
    email: string
    role: string
    created_at: string
    expires_at: string
    invitation_link?: string
}

const ROLE_COLORS = {
    owner: 'bg-primary/20 text-primary border-primary',
    admin: 'bg-blue-500/20 text-blue-400 border-blue-500',
    developer: 'bg-purple-500/20 text-purple-400 border-purple-500',
    viewer: 'bg-white/10 text-white/60 border-white/20'
}

export default function TeamManagePage() {
    const params = useParams()
    const router = useRouter()
    const teamId = params.id as string

    const [team, setTeam] = useState<Team | null>(null)
    const [members, setMembers] = useState<Member[]>([])
    const [invitations, setInvitations] = useState<Invitation[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Invite dialog state
    const [showInviteDialog, setShowInviteDialog] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteRole, setInviteRole] = useState<'admin' | 'developer' | 'viewer'>('developer')
    const [isInviting, setIsInviting] = useState(false)

    // Settings state
    const [showSettings, setShowSettings] = useState(false)
    const [teamName, setTeamName] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const loadTeam = useCallback(async () => {
        const res = await fetch(`/api/teams/${teamId}`)
        if (res.ok) {
            const data = await res.json()
            setTeam(data)
            setTeamName(data.name)
        }
    }, [teamId]);

    const loadMembers = useCallback(async () => {
        const res = await fetch(`/api/teams/${teamId}/members`)
        if (res.ok) {
            const data = await res.json()
            setMembers(data)
        }
    }, [teamId]);

    const loadInvitations = useCallback(async () => {
        const res = await fetch(`/api/teams/${teamId}/invitations`)
        if (res.ok) {
            const data = await res.json()
            setInvitations(data)
        }
    }, [teamId]);

    const loadTeamData = useCallback(async () => {
        setIsLoading(true)
        try {
            await Promise.all([
                loadTeam(),
                loadMembers(),
                loadInvitations()
            ])
        } finally {
            setIsLoading(false)
        }
    }, [loadTeam, loadMembers, loadInvitations]);

    useEffect(() => {
        loadTeamData()
    }, [loadTeamData])

    const handleInvite = async () => {
        if (!inviteEmail || !inviteEmail.includes('@')) {
            toast.error('Please enter a valid email')
            return
        }

        setIsInviting(true)
        const toastId = toast.loading('SENDING_INVITATION...')

        try {
            const res = await fetch(`/api/teams/${teamId}/invitations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole })
            })

            if (res.ok) {
                const invitation = await res.json()
                toast.success(`INVITATION_SENT: ${inviteEmail}`, { id: toastId })
                setShowInviteDialog(false)
                setInviteEmail("")
                loadInvitations()

                // Show invitation link
                if (invitation.invitation_link) {
                    toast.info('INVITATION_LINK_COPIED', {
                        description: 'Share this link with the invitee',
                        action: {
                            label: 'COPY',
                            onClick: () => {
                                navigator.clipboard.writeText(invitation.invitation_link)
                                toast.success('Link copied!')
                            }
                        }
                    })
                }
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to send invitation', { id: toastId })
            }
        } catch (error) {
            toast.error('Network error', { id: toastId })
        } finally {
            setIsInviting(false)
        }
    }

    const handleRemoveMember = async (memberId: string, memberName: string) => {
        toast.error(`REMOVE_MEMBER: ${memberName}`, {
            description: 'This action cannot be undone',
            action: {
                label: 'CONFIRM',
                onClick: async () => {
                    const res = await fetch(`/api/teams/${teamId}/members?memberId=${memberId}`, {
                        method: 'DELETE'
                    })
                    if (res.ok) {
                        toast.success('Member removed')
                        loadMembers()
                    }
                }
            }
        })
    }

    const handleCancelInvitation = async (invitationId: string, email: string) => {
        const res = await fetch(`/api/teams/${teamId}/invitations?invitationId=${invitationId}`, {
            method: 'DELETE'
        })
        if (res.ok) {
            toast.success(`Invitation cancelled: ${email}`)
            loadInvitations()
        }
    }

    const handleUpdateTeam = async () => {
        if (!teamName.trim() || teamName.trim().length < 3) {
            toast.error('Team name must be at least 3 characters')
            return
        }

        setIsSaving(true)
        const toastId = toast.loading('UPDATING_TEAM...')

        try {
            const res = await fetch(`/api/teams/${teamId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: teamName.trim() })
            })

            if (res.ok) {
                toast.success('TEAM_UPDATED', { id: toastId })
                setShowSettings(false)
                loadTeam()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to update team', { id: toastId })
            }
        } catch (error) {
            toast.error('Network error', { id: toastId })
        } finally {
            setIsSaving(false)
        }
    }

    const handleUpdateRole = async (memberUserId: string, newRole: string) => {
        const toastId = toast.loading('UPDATING_ROLE...')
        try {
            const res = await fetch(`/api/teams/${teamId}/members`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memberId: memberUserId, role: newRole })
            })

            if (res.ok) {
                toast.success('ROLE_UPDATED', { id: toastId })
                loadMembers()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to update role', { id: toastId })
            }
        } catch (error) {
            toast.error('Network error', { id: toastId })
        }
    }

    const canInvite = team?.role === 'owner' || team?.role === 'admin'
    const canRemove = team?.role === 'owner' || team?.role === 'admin'
    const canEditTeam = team?.role === 'owner' || team?.role === 'admin'

    const handleDeleteTeam = async () => {
        toast.error(`DELETE_TEAM: ${team?.name}`, {
            description: 'THIS ACTION IS IRREVERSIBLE. ALL TEAM AGENTS AND DATA WILL BE LOST.',
            action: {
                label: 'WIPE_CORES',
                onClick: async () => {
                    const res = await fetch(`/api/teams/${teamId}`, { method: 'DELETE' })
                    if (res.ok) {
                        toast.success('TEAM_DISSOLVED')
                        router.push('/dashboard')
                    } else {
                        toast.error('WIPE_FAILED')
                    }
                }
            }
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <RiLoader4Line className="w-8 h-8 text-primary animate-spin" />
            </div>
        )
    }

    if (!team) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white/40 font-black uppercase">TEAM_NOT_FOUND</p>
                    <Link href="/dashboard" className="text-primary text-sm font-black uppercase mt-4 inline-block">
                        RETURN_TO_DASHBOARD
                    </Link>
                </div>
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
                            <Link
                                href="/dashboard"
                                className="w-12 h-12 border-4 border-white/10 flex items-center justify-center hover:border-primary transition-all"
                            >
                                <RiArrowLeftLine className="w-6 h-6" />
                            </Link>
                            <div className="w-12 h-12 border-4 border-primary bg-primary/10 flex items-center justify-center">
                                <RiTeamFill className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-heading font-black uppercase tracking-tight">{team.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-1 text-[8px] font-black uppercase border ${ROLE_COLORS[team.role as keyof typeof ROLE_COLORS]}`}>
                                        {team.role}
                                    </span>
                                    <span className="text-[8px] font-black text-white/40 uppercase">•</span>
                                    <span className="text-[8px] font-black text-white/40 uppercase">{team.plan}_PLAN</span>
                                    <span className="text-[8px] font-black text-white/40 uppercase">•</span>
                                    <span className="text-[8px] font-black text-white/40 uppercase">{members.length}_MEMBERS</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {canEditTeam && (
                                <button
                                    onClick={() => setShowSettings(true)}
                                    className="px-4 py-2 border-2 border-white/20 font-black text-[10px] uppercase hover:bg-white/5 transition-all flex items-center gap-2"
                                >
                                    <RiSettings4Line className="w-4 h-4" /> SETTINGS
                                </button>
                            )}
                            {canInvite && (
                                <button
                                    onClick={() => setShowInviteDialog(true)}
                                    className="px-6 py-3 bg-primary text-black font-black text-[10px] uppercase hover:bg-white transition-all flex items-center gap-2"
                                >
                                    <RiUserAddLine className="w-4 h-4" /> INVITE_MEMBER
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-8 py-12">
                <div className="grid gap-8">
                    {/* Members Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-heading font-black uppercase">TEAM_MEMBERS</h2>
                            <span className="text-[10px] font-black text-white/40 uppercase">{members.length}_ACTIVE</span>
                        </div>
                        <div className="grid gap-4">
                            {members.map((member) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border-2 border-white/10 bg-white/[0.02] p-6 hover:border-primary/40 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {member.avatar ? (
                                                <Image
                                                    src={member.avatar}
                                                    alt={member.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-12 h-12 border-2 border-primary object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 border-2 border-white/20 bg-white/5 flex items-center justify-center">
                                                    <RiShieldUserLine className="w-6 h-6 text-white/40" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-sm font-black uppercase">{member.name}</div>
                                                <div className="text-[10px] font-mono text-white/40">{member.email}</div>
                                                <div className="text-[8px] font-black text-white/30 uppercase mt-1">
                                                    Joined {new Date(member.joined_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {canEditTeam && member.role !== 'owner' ? (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className={`px-3 py-1.5 text-[10px] font-black uppercase border hover:bg-white/5 transition-all ${ROLE_COLORS[member.role as keyof typeof ROLE_COLORS]}`}>
                                                            {member.role}
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="bg-black border-4 border-white text-white rounded-none">
                                                        {(['admin', 'developer', 'viewer'] as const).map((r) => (
                                                            <DropdownMenuItem
                                                                key={r}
                                                                onClick={() => handleUpdateRole(member.user_id, r)}
                                                                className="text-[10px] font-black uppercase p-3 focus:bg-primary focus:text-black cursor-pointer rounded-none"
                                                            >
                                                                {r}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            ) : (
                                                <span className={`px-3 py-1.5 text-[10px] font-black uppercase border ${ROLE_COLORS[member.role as keyof typeof ROLE_COLORS]}`}>
                                                    {member.role}
                                                </span>
                                            )}
                                            {canRemove && member.role !== 'owner' && (
                                                <button
                                                    onClick={() => handleRemoveMember(member.user_id, member.name)}
                                                    className="p-2 border-2 border-white/10 hover:border-red-500 hover:bg-red-500/10 transition-all"
                                                    title="Remove member"
                                                >
                                                    <RiDeleteBin6Line className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Invitations */}
                    {invitations.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-heading font-black uppercase">PENDING_INVITATIONS</h2>
                                <span className="text-[10px] font-black text-white/40 uppercase">{invitations.length}_PENDING</span>
                            </div>
                            <div className="grid gap-4">
                                {invitations.map((invitation) => (
                                    <div
                                        key={invitation.id}
                                        className="border-2 border-yellow-500/20 bg-yellow-500/5 p-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 border-2 border-yellow-500/40 bg-yellow-500/10 flex items-center justify-center">
                                                    <RiMailLine className="w-6 h-6 text-yellow-500" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black uppercase text-white">{invitation.email}</div>
                                                    <div className="text-[10px] font-black text-white/40 uppercase">
                                                        Invited {new Date(invitation.created_at).toLocaleDateString()} • Expires {new Date(invitation.expires_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1.5 text-[10px] font-black uppercase border ${ROLE_COLORS[invitation.role as keyof typeof ROLE_COLORS]}`}>
                                                    {invitation.role}
                                                </span>
                                                {canInvite && (
                                                    <button
                                                        onClick={() => handleCancelInvitation(invitation.id, invitation.email)}
                                                        className="p-2 border-2 border-white/10 hover:border-red-500 hover:bg-red-500/10 transition-all"
                                                        title="Cancel invitation"
                                                    >
                                                        <RiCloseLine className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Invite Dialog */}
            <AnimatePresence>
                {showInviteDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                        onClick={() => !isInviting && setShowInviteDialog(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-black border-4 border-primary p-8 max-w-lg w-full shadow-[12px_12px_0px_rgba(204,255,0,0.3)]"
                        >
                            <h2 className="text-2xl font-heading font-black uppercase mb-6">INVITE_TEAM_MEMBER</h2>

                            <div className="space-y-6">
                                <div>
                                    <Label className="text-[10px] font-black uppercase text-primary mb-2 block">EMAIL_ADDRESS</Label>
                                    <Input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="colleague@company.com"
                                        className="bg-black border-white/20 text-white"
                                        disabled={isInviting}
                                    />
                                </div>

                                <div>
                                    <Label className="text-[10px] font-black uppercase text-primary mb-3 block">ROLE</Label>
                                    <div className="grid gap-2">
                                        {(['admin', 'developer', 'viewer'] as const).map((role) => (
                                            <button
                                                key={role}
                                                onClick={() => setInviteRole(role)}
                                                className={`p-4 border-2 text-left transition-all ${inviteRole === role
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-white/10 hover:border-white/20'
                                                    }`}
                                                disabled={isInviting}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-xs font-black uppercase">{role}</div>
                                                        <div className="text-[8px] text-white/40 uppercase mt-1">
                                                            {role === 'admin' && 'Can manage members and resources'}
                                                            {role === 'developer' && 'Can create and edit agents'}
                                                            {role === 'viewer' && 'Read-only access'}
                                                        </div>
                                                    </div>
                                                    {inviteRole === role && <RiCheckLine className="w-5 h-5 text-primary" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setShowInviteDialog(false)}
                                    disabled={isInviting}
                                    className="flex-1 px-6 py-3 border-2 border-white/20 font-black text-[10px] uppercase hover:bg-white/5 transition-all disabled:opacity-50"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleInvite}
                                    disabled={isInviting || !inviteEmail}
                                    className="flex-1 px-6 py-3 bg-primary text-black font-black text-[10px] uppercase hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isInviting ? (
                                        <>
                                            <RiLoader4Line className="w-4 h-4 animate-spin" />
                                            SENDING...
                                        </>
                                    ) : (
                                        'SEND_INVITATION'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Dialog */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                        onClick={() => !isSaving && setShowSettings(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-black border-4 border-primary p-8 max-w-lg w-full"
                        >
                            <h2 className="text-2xl font-heading font-black uppercase mb-6">TEAM_SETTINGS</h2>

                            <div className="space-y-6">
                                <div>
                                    <Label className="text-[10px] font-black uppercase text-primary mb-2 block">TEAM_NAME</Label>
                                    <Input
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        className="bg-black border-white/20 text-white"
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setShowSettings(false)}
                                    disabled={isSaving}
                                    className="flex-1 px-6 py-3 border-2 border-white/20 font-black text-[10px] uppercase hover:bg-white/5 transition-all disabled:opacity-50"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleUpdateTeam}
                                    disabled={isSaving || teamName.trim().length < 3}
                                    className="flex-1 px-6 py-3 bg-primary text-black font-black text-[10px] uppercase hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <RiLoader4Line className="w-4 h-4 animate-spin" />
                                            SAVING...
                                        </>
                                    ) : (
                                        'SAVE_CHANGES'
                                    )}
                                </button>
                            </div>

                            {team?.role === 'owner' && (
                                <div className="mt-12 pt-8 border-t-2 border-red-500/20 space-y-4">
                                    <div className="text-[10px] font-black uppercase text-red-500 italic">DANGER_ZONE</div>
                                    <button
                                        onClick={handleDeleteTeam}
                                        className="w-full px-6 py-3 border-2 border-red-500/40 text-red-500 font-black text-[10px] uppercase hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        DISSOLVE_TEAM_ARCHIVE
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
