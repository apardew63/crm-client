import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover-lift relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-soft hover:shadow-medium hover:bg-primary/90 active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-soft hover:shadow-medium hover:bg-destructive/90 active:scale-[0.98]",
        outline:
          "border border-border bg-background shadow-soft hover:bg-accent hover:text-accent-foreground hover:shadow-medium active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/80 hover:shadow-medium active:scale-[0.98]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:shadow-soft active:scale-[0.98]",
        link: 
          "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        gradient:
          "bg-gradient-to-r from-primary to-earth-brown text-primary-foreground shadow-soft hover:shadow-medium hover:from-primary/90 hover:to-earth-brown/90 active:scale-[0.98]",
        glass:
          "glass-effect text-foreground hover:bg-white/90 dark:hover:bg-white/10 active:scale-[0.98]"
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-4 text-xs has-[>svg]:px-3",
        lg: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",
        icon: "size-10 rounded-lg",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 ease-out" />
    </Comp>
  );
}

export { Button, buttonVariants }
