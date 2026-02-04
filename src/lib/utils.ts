import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(timestamp: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(timestamp)
}

export function formatDate(timestamp: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(timestamp)
}

export function formatTokens(tokens: number): string {
  if (tokens < 1000) return tokens.toString()
  if (tokens < 1000000) return (tokens / 1000).toFixed(1) + 'K'
  return (tokens / 1000000).toFixed(1) + 'M'
}

export function formatLatency(ms: number): string {
  if (ms < 1000) return ms.toFixed(0) + 'ms'
  return (ms / 1000).toFixed(1) + 's'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}