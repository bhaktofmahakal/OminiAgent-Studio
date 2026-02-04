'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
    RiDashboardFill,
    RiMessage3Fill,
    RiUserFill,
    RiTerminalBoxFill,
    RiSettings4Fill,
    RiHome4Fill,
    RiRobot2Fill,
    RiBarChartFill,
    RiPulseFill,
    RiCompass3Fill,
    RiCommandLine,
    RiWebhookLine,
    RiTeamFill
} from 'react-icons/ri'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'DASHBOARD', href: '/dashboard', icon: RiDashboardFill, exact: true },
    { name: 'EXPLORE', href: '/explore', icon: RiCompass3Fill },
    { name: 'CHAT_STUDIO', href: '/dashboard/chat', icon: RiMessage3Fill },
    { name: 'ANALYTICS', href: '/dashboard/analytics', icon: RiBarChartFill },
    { name: 'TEAMS', href: '/dashboard/teams/create', icon: RiTeamFill },
    { name: 'WEBHOOKS', href: '/dashboard/webhooks', icon: RiWebhookLine },
    { name: 'DEVELOPER', href: '/dashboard/dev', icon: RiTerminalBoxFill },
    { name: 'PROFILE', href: '/dashboard/profile', icon: RiUserFill },
    { name: 'DEBUG_TOOLS', href: '/dashboard/debug', icon: RiCommandLine },
]

export default function DashboardSidebar() {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 bg-black border-r-2 border-white/20" />
    }

    return (
        <div className="flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r-2 border-white/20 bg-black z-50">
                <div className="flex flex-col flex-1 min-h-0">
                    {/* Logo Section */}
                    <div className="flex items-center h-20 px-6 border-b border-white/10">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary flex items-center justify-center text-black">
                                <RiRobot2Fill className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-heading font-black italic tracking-tighter text-lg leading-none text-[#ccff00]">OMN_SYS</span>
                                <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white mt-0.5">KERNEL_v4.0</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto font-body">
                        <div className="text-[9px] font-black text-white uppercase tracking-[0.4em] mb-4 pl-2">
                            / MAIN_INTERFACE
                        </div>
                        {navigation.map((item) => {
                            const isActive = item.exact
                                ? pathname === item.href
                                : pathname === item.href || pathname?.startsWith(item.href + '/')

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-4 px-4 py-3 text-[11px] font-black uppercase tracking-widest relative border-2 transition-all outline-none',
                                        isActive
                                            ? 'force-bg-primary force-visible-black border-[#ccff00] italic shadow-[4px_4px_0px_rgba(204,255,0,0.2)]'
                                            : 'force-visible-white border-transparent hover:bg-white/10 hover:border-white/20'
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5", isActive ? "force-visible-black" : "force-visible-white")} />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer System Support */}
                    <div className="p-4 border-t border-white/10 bg-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="border border-white/20">
                                <UserButton
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "h-8 w-8 rounded-none",
                                            userButtonTrigger: "rounded-none"
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <p className="text-[10px] font-black uppercase truncate text-white">Operator</p>
                                <p className="text-[8px] font-black text-primary truncate uppercase tracking-widest">Lvl_04_Privilege</p>
                            </div>
                        </div>

                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 py-2.5 text-[9px] font-black text-white hover:text-[#ccff00] transition-all uppercase tracking-widest border-2 border-dashed border-white/20"
                        >
                            <RiHome4Fill className="w-4 h-4" />
                            Return_to_Core
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Interface Controls */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20 px-6 border-b-4 border-white bg-[#080808]">
                <Link href="/" className="flex items-center gap-3">
                    <RiRobot2Fill className="w-6 h-6 text-primary" />
                    <span className="font-heading font-black italic text-lg tracking-tighter">OMN_SYS</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[8px] font-black text-primary uppercase">
                        <RiPulseFill className="animate-pulse" /> LIVE
                    </div>
                    <UserButton />
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-20 border-t-2 border-white/20 bg-black px-2 pb-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all',
                                isActive
                                    ? 'force-visible-primary'
                                    : 'text-white/40 hover:text-white'
                            )}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">{item.name.split('_')[0]}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
