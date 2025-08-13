import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dynamic-text-spacing border-dynamic border-dynamic-hover",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 border-dynamic-primary border-dynamic-primary-hover",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-dynamic",
        outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground border-dynamic-hover",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-dynamic",
        ghost: "hover:bg-accent hover:text-accent-foreground border-transparent hover:border-dynamic",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-10 py-3",
        xl: "h-14 rounded-lg px-12 py-4",
        comfortable: "h-11 rounded-md px-6 py-2.5",
        spacious: "h-12 rounded-lg px-8 py-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
