import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Full width container
        "w-full",
        // Base layout
        "bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm",
        // Padding adapts for different breakpoints
        "p-3 xs:p-4 sm:p-6 md:p-8",
        // Gap adapts with screen size
        "gap-3 sm:gap-4 lg:gap-6",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "w-full",
        "@container/card-header grid auto-rows-min items-start gap-1.5",
        "px-3 xs:px-4 sm:px-6 md:px-8",
        "grid-rows-[auto_auto] has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "[.border-b]:pb-3 sm:[.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "w-full",
        "font-semibold leading-snug",
        "text-base xs:text-lg sm:text-xl lg:text-2xl",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "w-full",
        "text-muted-foreground",
        "text-sm xs:text-base lg:text-lg",
        className
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "w-full",
        "px-3 xs:px-4 sm:px-6 md:px-8",
        "space-y-3 sm:space-y-4 lg:space-y-6",
        className
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "w-full",
        "flex flex-wrap gap-2 px-3 xs:px-4 sm:px-6 md:px-8",
        "[.border-t]:pt-3 sm:[.border-t]:pt-6",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
