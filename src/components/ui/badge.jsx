import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all duration-200 shadow-soft",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90 [a&]:hover:shadow-medium",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80 [a&]:hover:shadow-medium",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 [a&]:hover:shadow-medium",
        outline:
          "text-foreground border-border/50 bg-background/50 backdrop-blur-sm [a&]:hover:bg-accent [a&]:hover:text-accent-foreground [a&]:hover:shadow-medium",
        success:
          "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600 [a&]:hover:shadow-medium",
        warning:
          "border-transparent bg-yellow-500 text-white [a&]:hover:bg-yellow-600 [a&]:hover:shadow-medium",
        info:
          "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600 [a&]:hover:shadow-medium",
        glass:
          "glass-effect text-foreground [a&]:hover:bg-white/90 dark:[a&]:hover:bg-white/10",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }
