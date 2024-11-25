import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
}

export function StatusBadge({
  isActive,
  activeText = "Active",
  inactiveText = "Inactive",
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
        isActive
          ? "bg-green-50 text-green-700 ring-green-600/20"
          : "bg-gray-50 text-gray-600 ring-gray-500/10",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "mr-1 h-1.5 w-1.5 rounded-full",
          isActive ? "bg-green-400" : "bg-gray-400",
        )}
      />
      {isActive ? activeText : inactiveText}
    </span>
  );
}
