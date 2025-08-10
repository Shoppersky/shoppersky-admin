"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // Layout
        "flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 select-none font-medium",
        
        // Fluid font size: min 12px, scales with screen width, max 18px
        "text-[clamp(12px,1.5vw,18px)]",
        
        // Allow wrapping
        "whitespace-normal break-words",
        
        // Disabled states
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        
        className
      )}
      {...props}
    />
  )
}

export { Label }
