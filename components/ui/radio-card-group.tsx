"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface RadioCardOption {
  value: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

interface RadioCardGroupProps {
  options: RadioCardOption[]
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  name?: string
}

const RadioCardGroup = React.forwardRef<React.ElementRef<typeof RadioGroup>, RadioCardGroupProps>(
  ({ options, value, onValueChange, className, ...props }, ref) => {
    return (
      <RadioGroup
        ref={ref}
        value={value}
        onValueChange={onValueChange}
        className={cn("grid gap-4", className)}
        {...props}
      >
        {options.map((option) => (
          <div key={option.value} className="relative">
            <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
            <Label htmlFor={option.value} className="cursor-pointer">
              <Card
                className={cn(
                  "transition-all duration-200 hover:shadow-md border-2",
                  "hover:border-primary/50",
                  value === option.value && "border-transparent bg-gradient-to-br from-primary to-blue-600 shadow-lg ring-2 ring-primary/30",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                )}
              >
                <CardContent className="flex items-center p-4 space-x-3 peer-checked:text-white">
                  {option.icon && (
                    <option.icon className={cn(
                      "h-5 w-5 text-muted-foreground transition-colors",
                      value === option.value && "text-white"
                    )} />
                  )}
                  <span className={cn(
                    "font-inter text-fluid-base font-light transition-all",
                    value === option.value && "text-white font-medium"
                  )}>
                    {option.label}
                  </span>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    )
  },
)

RadioCardGroup.displayName = "RadioCardGroup"

export { RadioCardGroup, type RadioCardOption }
