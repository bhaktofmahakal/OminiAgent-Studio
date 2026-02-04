'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import {
  Bot, MessageSquare, Settings, BarChart3, Plus, Search,
  User, LogOut, Moon, Sun, Keyboard, Users, Globe,
  FileText, Download, Upload, Share2
} from 'lucide-react'
import { useTheme } from 'next-themes'

interface CommandPaletteProps {
  agents?: Array<{
    id: string
    name: string
    description: string
  }>
}

export default function CommandPalette({ agents = [] }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { signOut } = useAuth()
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Navigation Commands */}
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
            <Bot className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/chat'))}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Multi-Model Chat</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/create'))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create New Agent</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/analytics'))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics Dashboard</span>
          </CommandItem>
        </CommandGroup>

        {/* Agents */}
        {agents.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Your Agents">
              {agents.slice(0, 5).map((agent) => (
                <CommandItem
                  key={agent.id}
                  onSelect={() => runCommand(() => router.push(`/agent/${agent.id}`))}
                >
                  <Bot className="mr-2 h-4 w-4" />
                  <span>{agent.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {agent.description?.slice(0, 30)}...
                  </span>
                </CommandItem>
              ))}
              {agents.length > 5 && (
                <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
                  <Search className="mr-2 h-4 w-4" />
                  <span>View all agents ({agents.length})</span>
                </CommandItem>
              )}
            </CommandGroup>
          </>
        )}

        {/* Actions */}
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => {
            const url = `${window.location.origin}/dashboard`
            navigator.clipboard.writeText(url)
          })}>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Copy Dashboard Link</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {
            // Trigger export functionality
            const data = { agents, timestamp: new Date().toISOString() }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'agents-backup.json'
            a.click()
            URL.revokeObjectURL(url)
          })}>
            <Download className="mr-2 h-4 w-4" />
            <span>Export Agents Data</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {
            // Trigger documentation
            window.open('/docs', '_blank')
          })}>
            <FileText className="mr-2 h-4 w-4" />
            <span>View Documentation</span>
          </CommandItem>
        </CommandGroup>

        {/* Settings */}
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}>
            {theme === 'dark' ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/profile'))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {
            // Show keyboard shortcuts modal
            alert('Keyboard Shortcuts:\n\n⌘+K - Command Palette\n⌘+N - New Agent\n⌘+/ - Search\n⌘+B - Toggle Sidebar')
          })}>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>Keyboard Shortcuts</span>
          </CommandItem>
        </CommandGroup>

        {/* Account */}
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem onSelect={() => runCommand(() => signOut())}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}