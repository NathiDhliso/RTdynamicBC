"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, RotateCcw, Save } from "lucide-react"
import { spacingConfig, type SpacingConfig } from "@/lib/spacing-config"

interface SpacingControlsProps {
  className?: string
}

export default function SpacingControls({ className }: SpacingControlsProps) {
  const [config, setConfig] = useState<SpacingConfig>(spacingConfig.getConfig())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load initial config
    setConfig(spacingConfig.getConfig())
  }, [])

  const handleConfigChange = (key: keyof SpacingConfig, value: number) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    spacingConfig.updateConfig({ [key]: value })
  }

  const handlePresetChange = (preset: string) => {
    spacingConfig.applyPreset(preset as any)
    setConfig(spacingConfig.getConfig())
  }

  const handleReset = () => {
    spacingConfig.resetToDefault()
    setConfig(spacingConfig.getConfig())
  }

  const handleSave = () => {
    spacingConfig.saveToStorage()
    // Show a brief success message (you could add a toast here)
    console.log('Spacing configuration saved!')
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-50 shadow-lg ${className}`}
      >
        <Settings className="h-4 w-4 mr-2" />
        Spacing
      </Button>
    )
  }

  return (
    <Card className={`fixed bottom-4 right-4 z-50 w-80 shadow-xl ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Spacing Controls
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preset Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quick Presets</Label>
          <Select onValueChange={handlePresetChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a preset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="comfortable">Comfortable</SelectItem>
              <SelectItem value="spacious">Spacious</SelectItem>
              <SelectItem value="extra-spacious">Extra Spacious</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Text Spacing Multiplier */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Text Spacing: {config.textSpacingMultiplier.toFixed(1)}x
          </Label>
          <Slider
            value={[config.textSpacingMultiplier]}
            onValueChange={([value]) => handleConfigChange('textSpacingMultiplier', value)}
            min={0.5}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Letter Spacing */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Letter Spacing: {config.letterSpacingBase.toFixed(3)}em
          </Label>
          <Slider
            value={[config.letterSpacingBase]}
            onValueChange={([value]) => handleConfigChange('letterSpacingBase', value)}
            min={0}
            max={0.05}
            step={0.001}
            className="w-full"
          />
        </div>

        {/* Word Spacing */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Word Spacing: {config.wordSpacingBase.toFixed(2)}em
          </Label>
          <Slider
            value={[config.wordSpacingBase]}
            onValueChange={([value]) => handleConfigChange('wordSpacingBase', value)}
            min={0}
            max={0.5}
            step={0.01}
            className="w-full"
          />
        </div>

        {/* Border Opacity */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Border Opacity: {Math.round(config.borderOpacity * 100)}%
          </Label>
          <Slider
            value={[config.borderOpacity]}
            onValueChange={([value]) => handleConfigChange('borderOpacity', value)}
            min={0}
            max={1}
            step={0.05}
            className="w-full"
          />
        </div>

        {/* Border Hover Opacity */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Border Hover: {Math.round(config.borderHoverOpacity * 100)}%
          </Label>
          <Slider
            value={[config.borderHoverOpacity]}
            onValueChange={([value]) => handleConfigChange('borderHoverOpacity', value)}
            min={0}
            max={1}
            step={0.05}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Changes apply instantly. Save to remember your preferences.
        </p>
      </CardContent>
    </Card>
  )
}