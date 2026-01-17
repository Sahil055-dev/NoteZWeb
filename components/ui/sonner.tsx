"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group "
      icons={{
        success: <CircleCheckIcon className="size-6 text-secondary" />,
        info: <InfoIcon className="size-6 text-secondary" />,
        warning: <TriangleAlertIcon className="size-6 text-secondary" />,
        error: <OctagonXIcon className="size-6 text-secondary" />,
        loading: <Loader2Icon className="size-6 animate-spin text-secondary" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
