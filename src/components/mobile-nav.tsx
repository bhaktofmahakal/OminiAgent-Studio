'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  Menu, Bot, MessageSquare, BarChart3, Settings, Plus,
  Home, User, LogOut, Sparkles, Command, Terminal
} from 'lucide-react'
import { useAuth, UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, code: '0x01' },
  { name: 'Chat', href: '/chat', icon: MessageSquare, code: '0x02' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, code: '0x03' },
  { name: 'Create Agent', href: '/dashboard/create', icon: Plus, code: '0x04' },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { isSignedIn } = useAuth()

  if (!isSignedIn) return null

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="p-3 bg-white/5 border border-white/10 text-primary">
            <Menu className="w-5 h-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-slate-950 border-r border-white/5 p-0">
          <div className="h-full flex flex-col">
            <SheetHeader className="p-8 border-b border-white/5">
              <SheetTitle className="flex items-center space-x-3 text-left">
                <div className="p-2 border border-primary bg-primary/10">
                  <Command className="w-4 h-4 text-primary" />
                </div>
                <span className="font-heading text-xl font-black text-white tracking-widest uppercase">
                  OMNI<span className="text-primary">AGENT</span>
                </span>
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 px-4 py-8 space-y-2">
              <div className="px-4 mb-4 font-mono text-[9px] text-slate-600 uppercase tracking-[0.2em] italic">
                System_Navigation:
              </div>
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "group flex items-center justify-between px-4 py-3 border transition-all duration-200",
                      isActive
                        ? "bg-primary/5 border-primary/40 text-primary"
                        : "bg-transparent border-transparent text-slate-500 hover:border-white/10 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-slate-600")} />
                      <span className="font-mono text-xs uppercase tracking-widest">{item.name}</span>
                    </div>
                    <span className="font-mono text-[8px] opacity-30 italic">{item.code}</span>
                  </Link>
                )
              })}
            </div>

            <div className="p-8 border-t border-white/5 space-y-6">
              <div className="flex items-center gap-4 group">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 border border-white/10 group-hover:border-primary/50 transition-colors"
                    }
                  }}
                />
                <div className="flex-1 font-mono">
                  <p className="text-[10px] text-white uppercase tracking-widest">Active_Session</p>
                  <p className="text-[8px] text-slate-600 uppercase italic">status: normal</p>
                </div>
              </div>
              <div className="pt-4 flex justify-between font-mono text-[8px] text-slate-700 uppercase tracking-widest italic">
                <span>© 2026 OMNI_LAB</span>
                <span className="text-primary/40 animate-pulse">Link: SECURE</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}