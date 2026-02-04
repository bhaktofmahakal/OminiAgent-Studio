import { cn } from "@/lib/utils"

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'rainbow'
}

export function GradientText({ 
  className, 
  variant = 'primary',
  children,
  ...props 
}: GradientTextProps) {
  const variants = {
    primary: "bg-gradient-to-r from-primary via-purple-600 to-blue-600",
    secondary: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500", 
    accent: "bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500",
    rainbow: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500"
  }

  return (
    <span 
      className={cn(
        variants[variant],
        "bg-clip-text text-transparent bg-size-200 animate-gradient-x font-bold",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}