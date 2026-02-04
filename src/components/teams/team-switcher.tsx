"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    RiTeamFill,
    RiArrowDownSLine,
    RiAddLine,
    RiCheckLine,
    RiSettings4Line
} from "react-icons/ri"
import Link from "next/link"

interface Team {
    id: string
    name: string
    slug: string
    role: string
    plan: string
}

interface TeamSwitcherProps {
    currentTeamId?: string | null
    onTeamChange?: (teamId: string) => void
}

export default function TeamSwitcher({ currentTeamId, onTeamChange }: TeamSwitcherProps) {
    const [teams, setTeams] = useState<Team[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [currentTeam, setCurrentTeam] = useState<Team | null>(null)

    useEffect(() => {
        loadTeams()
    }, [])

    useEffect(() => {
        if (currentTeamId && teams.length > 0) {
            const team = teams.find(t => t.id === currentTeamId)
            if (team) setCurrentTeam(team)
        } else if (teams.length > 0 && !currentTeam) {
            setCurrentTeam(teams[0])
        }
    }, [currentTeamId, teams])

    const loadTeams = async () => {
        try {
            const res = await fetch('/api/teams')
            if (res.ok) {
                const data = await res.json()
                setTeams(data)
            }
        } catch (error) {
            console.error('Failed to load teams:', error)
        }
    }

    const handleTeamSelect = (team: Team) => {
        setCurrentTeam(team)
        setIsOpen(false)
        if (onTeamChange) {
            onTeamChange(team.id)
        }
        // Store in localStorage for persistence
        localStorage.setItem('currentTeamId', team.id)
    }

    if (teams.length === 0) {
        return null // No teams yet
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 border-2 border-white/10 bg-black hover:border-primary transition-all group"
            >
                <div className="w-8 h-8 border-2 border-primary bg-primary/10 flex items-center justify-center">
                    <RiTeamFill className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                    <div className="text-[10px] font-black uppercase text-white/40">WORKSPACE</div>
                    <div className="text-xs font-black uppercase text-white group-hover:text-primary transition-colors">
                        {currentTeam?.name || 'Select Team'}
                    </div>
                </div>
                <RiArrowDownSLine className={`w-5 h-5 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-2 w-80 bg-black border-4 border-primary shadow-[8px_8px_0px_rgba(204,255,0,0.3)] z-50"
                        >
                            {/* Header */}
                            <div className="p-4 border-b-2 border-white/10 bg-primary/5">
                                <div className="text-[10px] font-black uppercase text-primary">YOUR_WORKSPACES</div>
                            </div>

                            {/* Teams List */}
                            <div className="max-h-96 overflow-y-auto">
                                {teams.map((team) => (
                                    <button
                                        key={team.id}
                                        onClick={() => handleTeamSelect(team)}
                                        className={`w-full p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/[0.02] transition-all ${currentTeam?.id === team.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 border-2 flex items-center justify-center ${currentTeam?.id === team.id ? 'border-primary bg-primary/20' : 'border-white/10 bg-white/[0.02]'
                                                }`}>
                                                <RiTeamFill className={`w-5 h-5 ${currentTeam?.id === team.id ? 'text-primary' : 'text-white/40'}`} />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-black uppercase text-white">{team.name}</div>
                                                <div className="text-[8px] font-black uppercase text-white/40 flex items-center gap-2">
                                                    <span className={`px-1.5 py-0.5 ${team.role === 'owner' ? 'bg-primary/20 text-primary' :
                                                            team.role === 'admin' ? 'bg-blue-500/20 text-blue-400' :
                                                                team.role === 'developer' ? 'bg-purple-500/20 text-purple-400' :
                                                                    'bg-white/10 text-white/60'
                                                        }`}>
                                                        {team.role}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{team.plan.toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {currentTeam?.id === team.id && (
                                            <RiCheckLine className="w-5 h-5 text-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t-2 border-white/10 bg-black/60 space-y-2">
                                <Link
                                    href="/dashboard/teams/create"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full px-4 py-3 bg-primary text-black font-black text-[10px] uppercase hover:bg-white transition-all flex items-center justify-center gap-2"
                                >
                                    <RiAddLine className="w-4 h-4" /> CREATE_TEAM
                                </Link>
                                {currentTeam && (
                                    <Link
                                        href={`/dashboard/teams/${currentTeam.id}`}
                                        onClick={() => setIsOpen(false)}
                                        className="w-full px-4 py-3 border-2 border-white/20 font-black text-[10px] uppercase hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                                    >
                                        <RiSettings4Line className="w-4 h-4" /> MANAGE_TEAM
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
