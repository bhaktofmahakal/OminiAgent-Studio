'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, MessageSquare, Bot, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      label: 'Create Agent',
      href: '/dashboard/create',
      icon: Bot,
      color: 'bg-primary hover:bg-primary/90'
    },
    {
      label: 'Start Chat',
      href: '/chat',
      icon: MessageSquare,
      color: 'bg-blue-600 hover:bg-blue-700'
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 md:hidden z-40">
      {/* Action Items */}
      <div className={cn(
        "flex flex-col space-y-3 mb-4 transition-all duration-300 transform-gpu",
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      )}>
        {actions.map((action, index) => (
          <div
            key={action.label}
            className={cn(
              "flex items-center space-x-3 transition-all duration-300",
              isOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div className="bg-background border border-border rounded-full px-3 py-2 text-sm font-medium shadow-lg">
              {action.label}
            </div>
            <Button
              size="sm"
              className={cn(
                "h-12 w-12 rounded-full shadow-lg transition-transform hover:scale-105",
                action.color
              )}
              asChild
            >
              <Link href={action.href} onClick={() => setIsOpen(false)}>
                <action.icon className="h-5 w-5" />
                <span className="sr-only">{action.label}</span>
              </Link>
            </Button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300",
          isOpen && "rotate-45"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
        <span className="sr-only">Quick actions</span>
      </Button>
    </div>
  )
}