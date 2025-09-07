// Enhanced Card component without shadow for order details
import * as React from "react"
import { cn } from "@/lib/utils"

export function OrderCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6",
        className
      )}
      {...props}
    />
  )
}