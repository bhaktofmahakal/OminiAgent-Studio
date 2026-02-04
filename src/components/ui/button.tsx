import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-mono uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-30 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border border-primary text-primary hover:bg-primary hover:text-black",
        destructive: "border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white",
        outline: "border border-white/10 text-white/60 hover:border-white hover:text-white",
        secondary: "bg-white/5 border border-white/5 text-white/80 hover:bg-white/10",
        ghost: "hover:bg-white/5 text-white/40 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        tech: "tech-button border-primary text-primary",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4",
        lg: "h-14 px-10 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }