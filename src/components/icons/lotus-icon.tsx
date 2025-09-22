
import { cn } from "@/lib/utils";
import React from "react";

export function LotusIcon({ className, ...props }: React.HTMLAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-6 w-6", className)}
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.3"/>
      <path d="M12 5c-2.42 0-4.5 1.7-5 4h10c-.5-2.3-2.58-4-5-4zm0 14c3.86 0 7-3.14 7-7H5c0 3.86 3.14 7 7 7z" opacity="0.6"/>
      <path d="M12 7c-1.39 0-2.6.7-3.32 1.8L12 14.17l3.32-5.37C14.6 7.7 13.39 7 12 7zm0 10c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
    </svg>
  );
}
