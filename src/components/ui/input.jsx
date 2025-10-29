import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "flex h-10 w-full min-w-0 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm px-4 py-2 text-sm",
        "shadow-soft transition-all duration-200 outline-none",
        "hover:border-border hover:shadow-medium hover:bg-background/80",
        "focus:border-ring focus:ring-2 focus:ring-ring/20 focus:shadow-medium focus:bg-background",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:rounded-md file:px-3 file:mr-3",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props} />
  );
}

export { Input }
