"use client"

import { cn } from "@/lib/utils"
import { ReactNode, createContext, useContext, useMemo } from "react"

export type ChartConfig = Record<string, { label: string; color: string }>

const ChartContext = createContext<{ config: ChartConfig } | null>(null)

interface ChartContainerProps {
  config: ChartConfig
  children: ReactNode
}

export function ChartContainer({ config, children }: ChartContainerProps) {
  const value = useMemo(() => ({ config }), [config])
  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
}

export function ChartTooltip({ children, ...props }: any) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-lg border bg-background px-3 py-2 text-sm shadow-lg",
      )}
    >
      {children}
    </div>
  )
}

export function ChartTooltipContent({ active, payload, label, indicator }: any) {
  const { config } = useContext(ChartContext)!
  if (!active || !payload) return null
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      {payload.map(({ value, name }: any) => (
        <div key={name} className="flex items-center gap-2">
          <div
            className={cn("h-1 w-1 rounded-full", {
              "bg-[var(--chart-1)]": name === "desktop",
              "bg-[var(--chart-2)]": name === "mobile",
            })}
          />
          <p className="text-sm font-medium">{config[name].label}</p>
          <p className="text-sm text-muted-foreground">{value}</p>
        </div>
      ))}
    </div>
  )
}
