"use client"

import * as React from "react"
import { Check, ChevronDown, Zap, Brain, Sparkles, Rocket, Bot, Star, Bolt, Crown, Flame, Shield, Diamond, Gem } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface Model {
  id: string
  name: string
  provider: string
  description: string
  latency: number
  cost: number
  capabilities: string[]
  status: 'active' | 'inactive' | 'error'
  icon: React.ReactNode
  color: string
}

const models: Model[] = [
  // 🔥 Flagship Premium Models
  {
    id: "claude-3-5-sonnet-latest",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "👑 Best-in-class reasoning and coding performance",
    latency: 156,
    cost: 0.015,
    capabilities: ["reasoning", "analysis", "coding", "creative"],
    status: "active",
    icon: <Sparkles className="w-4 h-4" />,
    color: "claude"
  },

  // OpenAI Models
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Most capable GPT-4 variant for complex tasks",
    latency: 89,
    cost: 0.03,
    capabilities: ["reasoning", "coding", "creative", "multimodal"],
    status: "active",
    icon: <Brain className="w-4 h-4" />,
    color: "gpt"
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    description: "Fast and cost-effective GPT-4 model",
    latency: 65,
    cost: 0.01,
    capabilities: ["reasoning", "coding", "chat"],
    status: "active",
    icon: <Bolt className="w-4 h-4" />,
    color: "gpt"
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    description: "Enhanced GPT-4 with improved speed",
    latency: 102,
    cost: 0.025,
    capabilities: ["reasoning", "coding", "creative"],
    status: "active",
    icon: <Rocket className="w-4 h-4" />,
    color: "gpt"
  },

  // Claude Models
  {
    id: "claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    description: "Fast and efficient Claude for quick tasks",
    latency: 98,
    cost: 0.008,
    capabilities: ["reasoning", "analysis", "chat"],
    status: "active",
    icon: <Bot className="w-4 h-4" />,
    color: "claude"
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    description: "Most capable Claude for complex reasoning",
    latency: 203,
    cost: 0.045,
    capabilities: ["advanced-reasoning", "creative", "analysis"],
    status: "active",
    icon: <Star className="w-4 h-4" />,
    color: "claude"
  },

  // Google Gemini Models  
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    description: "Ultra-fast Gemini for quick responses",
    latency: 42,
    cost: 0.006,
    capabilities: ["speed", "multimodal", "chat"],
    status: "active",
    icon: <Bolt className="w-4 h-4" />,
    color: "gemini"
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    description: "Advanced multimodal capabilities",
    latency: 203,
    cost: 0.02,
    capabilities: ["multimodal", "reasoning", "creative"],
    status: "active",
    icon: <Zap className="w-4 h-4" />,
    color: "gemini"
  },
  {
    id: "gemini-1.0-pro",
    name: "Gemini 1.0 Pro",
    provider: "Google",
    description: "Reliable Gemini for general tasks",
    latency: 178,
    cost: 0.015,
    capabilities: ["reasoning", "chat", "analysis"],
    status: "active",
    icon: <Bot className="w-4 h-4" />,
    color: "gemini"
  },

  // Groq Models (Ultra-Fast)
  {
    id: "llama-3.1-8b-groq",
    name: "Llama 3.1 8B (Groq)",
    provider: "Meta/Groq",
    description: "Lightning-fast Llama on Groq infrastructure",
    latency: 28,
    cost: 0.002,
    capabilities: ["speed", "coding", "chat"],
    status: "active",
    icon: <Flame className="w-4 h-4" />,
    color: "groq"
  },
  {
    id: "llama-3.1-70b-groq",
    name: "Llama 3.1 70B (Groq)",
    provider: "Meta/Groq",
    description: "Powerful Llama with ultra-fast inference",
    latency: 48,
    cost: 0.008,
    capabilities: ["reasoning", "coding", "speed"],
    status: "active",
    icon: <Rocket className="w-4 h-4" />,
    color: "groq"
  },
  {
    id: "mixtral-8x7b-groq",
    name: "Mixtral 8x7B (Groq)",
    provider: "Mistral/Groq",
    description: "Expert mixture model with blazing speed",
    latency: 35,
    cost: 0.003,
    capabilities: ["speed", "coding", "reasoning"],
    status: "active",
    icon: <Shield className="w-4 h-4" />,
    color: "groq"
  },
  {
    id: "mixtral-8x22b-groq",
    name: "Mixtral 8x22B (Groq)",
    provider: "Mistral/Groq",
    description: "Largest Mixtral with superior capabilities",
    latency: 68,
    cost: 0.012,
    capabilities: ["advanced-reasoning", "coding", "speed"],
    status: "active",
    icon: <Crown className="w-4 h-4" />,
    color: "groq"
  },

  // OpenRouter Models
  {
    id: "qwen/qwen-2.5-72b-instruct",
    name: "Qwen 2.5 72B",
    provider: "Alibaba/OpenRouter",
    description: "Advanced Chinese AI model with global capabilities",
    latency: 145,
    cost: 0.018,
    capabilities: ["multilingual", "reasoning", "coding"],
    status: "active",
    icon: <Bot className="w-4 h-4" />,
    color: "openrouter"
  },
  {
    id: "anthropic/claude-3.5-sonnet:beta",
    name: "Claude 3.5 Sonnet Beta",
    provider: "Anthropic/OpenRouter",
    description: "Latest Claude with experimental features",
    latency: 167,
    cost: 0.022,
    capabilities: ["experimental", "reasoning", "creative"],
    status: "active",
    icon: <Star className="w-4 h-4" />,
    color: "claude"
  },
  {
    id: "deepseek/deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek/OpenRouter",
    description: "Advanced reasoning model for complex tasks",
    latency: 189,
    cost: 0.016,
    capabilities: ["reasoning", "analysis", "coding"],
    status: "active",
    icon: <Brain className="w-4 h-4" />,
    color: "deepseek"
  },
  {
    id: "x-ai/grok-beta",
    name: "Grok Beta",
    provider: "xAI/OpenRouter",
    description: "Elon's AI with real-time web access",
    latency: 198,
    cost: 0.024,
    capabilities: ["real-time", "reasoning", "creative"],
    status: "active",
    icon: <Bolt className="w-4 h-4" />,
    color: "grok"
  },
  {
    id: "perplexity/llama-3.1-sonar-huge-128k-online",
    name: "Perplexity Sonar Huge",
    provider: "Perplexity/OpenRouter",
    description: "Web-connected AI for latest information",
    latency: 234,
    cost: 0.028,
    capabilities: ["web-search", "reasoning", "real-time"],
    status: "active",
    icon: <Zap className="w-4 h-4" />,
    color: "perplexity"
  }
]

interface ModelSelectorProps {
  selectedModel: string
  onModelSelect: (modelId: string) => void
  className?: string
  disabled?: boolean
  showLatency?: boolean
  showCost?: boolean
}

export function ModelSelector({
  selectedModel,
  onModelSelect,
  className,
  disabled = false,
  showLatency = true,
  showCost = true
}: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const selected = models.find(model => model.id === selectedModel)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full h-12 justify-between bg-black/40 hover:bg-black/60 border-white/20 rounded-none font-black text-[10px] uppercase tracking-widest text-white transition-all",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-3">
            {selected ? (
              <>
                <div className={cn("w-2 h-2 rounded-full", `bg-model-${selected.color}`)} />
                {selected.icon}
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest force-visible-white">{selected.name}</span>
                  {showLatency && (
                    <span className="text-[8px] font-black text-white/40 uppercase italic">
                      {selected.latency}ms_AVG
                    </span>
                  )}
                </div>
              </>
            ) : (
              <span className="text-muted-foreground">Select model...</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-black border border-white/20 rounded-none shadow-[10px_10px_0px_rgba(0,0,0,0.5)]" align="start">
        <Command className="bg-black text-white">
          <CommandInput placeholder="SEARCH_MODELS..." className="h-12 border-white/10 font-black text-[10px] uppercase tracking-widest" />
          <CommandList>
            <CommandEmpty>No models found.</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onModelSelect(model.id)
                    setOpen(false)
                  }}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-primary/10 aria-selected:bg-[#ccff00] aria-selected:text-black transition-colors rounded-none border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", `bg-model-${model.color}`)} />
                    {model.icon}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-[10px] uppercase tracking-widest">{model.name}</span>
                        <div className={`px-2 py-0.5 text-[7px] font-black uppercase tracking-tighter ${model.status === "active" ? "bg-primary/20 text-primary" : "bg-red-500/20 text-red-500"}`}>
                          {model.status}
                        </div>
                      </div>
                      <span className="text-[8px] font-black text-white/40 uppercase italic mt-1">
                        {model.description}
                      </span>
                      <div className="flex items-center gap-3 mt-1">
                        {showLatency && (
                          <span className="text-[7px] font-black text-white/40 uppercase">
                            {model.latency}ms_P0
                          </span>
                        )}
                        {showCost && (
                          <span className="text-[7px] font-black text-white/40 uppercase">
                            ${model.cost}/1K_TKN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedModel === model.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { models }