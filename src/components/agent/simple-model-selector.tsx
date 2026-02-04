"use client"

import * as React from "react"
import { models } from "./model-selector"
import { ChevronDown, Zap, Brain, Sparkles, Rocket } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SimpleModelSelectorProps {
  selectedModel: string
  onModelSelect: (modelId: string) => void
  className?: string
  disabled?: boolean
}

export function SimpleModelSelector({
  selectedModel,
  onModelSelect,
  className = "",
  disabled = false
}: SimpleModelSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const selected = models.find(model => model.id === selectedModel)

  const providers = Array.from(new Set(models.map(m => m.provider)))

  return (
    <div className={cn("w-full space-y-3", className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            disabled={disabled}
            className={cn(
              "w-full flex items-center justify-between p-4 border-2 border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/40 transition-all text-left group",
              disabled && "opacity-50 cursor-not-allowed",
              open && "border-primary shadow-[4px_4px_0px_#ccff00]"
            )}
          >
            <div className="flex items-center gap-3">
              {selected?.icon}
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                  {selected?.name || "Select Model"}
                </span>
                <span className="text-[7px] font-black text-white uppercase tracking-[0.2em]">
                  {selected?.provider} / {selected?.latency}MS
                </span>
              </div>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-white/20 group-hover:text-primary transition-all", open && "rotate-180 text-primary")} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[280px] bg-[#0d0d0d] border-2 border-white/10 p-2 shadow-2xl z-[100]" align="start">
          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-2 px-2 italic">
            / AVAILABLE_ENGINES
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/5" />
          <div className="max-h-[300px] overflow-y-auto dropdown-scrollbar pr-1">
            {providers.map((provider: string) => (
              <DropdownMenuGroup key={provider}>
                <DropdownMenuLabel className="text-[8px] font-black uppercase tracking-widest text-primary mt-3 mb-1 px-2">
                  {provider}
                </DropdownMenuLabel>
                {models.filter(m => m.provider === provider).map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => {
                      onModelSelect(model.id)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-none mb-1 cursor-pointer transition-all border border-transparent",
                      selectedModel === model.id ? "bg-primary/20 border-primary/40" : "hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-1 h-1 rounded-full", `bg-model-${model.color}`)} />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-white">{model.name}</span>
                        <span className="text-[7px] font-black text-white uppercase tracking-widest">{model.description.slice(0, 30)}...</span>
                      </div>
                    </div>
                    <div className="text-[8px] font-black text-white italic">{model.latency}ms</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {selected && (
        <div className="p-4 border border-dashed border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[7px] font-black text-white uppercase tracking-[0.3em]">CAPABILITIES</div>
            <div className="flex gap-2">
              {selected.capabilities.slice(0, 2).map((cap: string) => (
                <Badge key={cap} variant="outline" className="text-[7px] font-black h-4 px-2 bg-white/5 border-none opacity-40 uppercase">
                  {cap}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[7px] font-black text-white uppercase tracking-[0.3em]">COST_PER_1K</div>
            <div className="text-[10px] font-black text-primary italic">${selected.cost}</div>
          </div>
        </div>
      )}
    </div>
  )
}
