'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface RouteConfigProps {
  config: any
  setConfig: (config: any) => void
  ports: Array<{ name: string }>
  shipTypes: Record<string, any>
  loading: boolean
  onOptimize: () => void
}

export function RouteConfig({
  config,
  setConfig,
  ports,
  shipTypes,
  loading,
  onOptimize,
}: RouteConfigProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Route Configuration</CardTitle>
        <CardDescription>Set your optimization parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Port Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Start Port</label>
          <select
            value={config.start_port}
            onChange={(e) => setConfig({ ...config, start_port: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {ports.map((port) => (
              <option key={port.name} value={port.name}>
                {port.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">End Port</label>
          <select
            value={config.end_port}
            onChange={(e) => setConfig({ ...config, end_port: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {ports.map((port) => (
              <option key={port.name} value={port.name}>
                {port.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ship Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Ship Type</label>
          <select
            value={config.ship_type}
            onChange={(e) => setConfig({ ...config, ship_type: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.keys(shipTypes).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Optimization Priorities */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-semibold text-foreground text-sm">Optimization Priorities</h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <label className="text-foreground">Time</label>
              <span className="text-accent font-medium">{(config.objectives.time * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.objectives.time}
              onChange={(e) => {
                const newVal = parseFloat(e.target.value)
                const remaining = 1 - newVal
                const costRatio = config.objectives.cost / (config.objectives.cost + config.objectives.safety)
                setConfig({
                  ...config,
                  objectives: {
                    time: newVal,
                    cost: remaining * costRatio,
                    safety: remaining * (1 - costRatio),
                  },
                })
              }}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <label className="text-foreground">Cost</label>
              <span className="text-accent font-medium">{(config.objectives.cost * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.objectives.cost}
              onChange={(e) => {
                const newVal = parseFloat(e.target.value)
                const remaining = 1 - newVal
                const safetyRatio = config.objectives.safety / (config.objectives.safety + config.objectives.time)
                setConfig({
                  ...config,
                  objectives: {
                    time: remaining * (1 - safetyRatio),
                    cost: newVal,
                    safety: remaining * safetyRatio,
                  },
                })
              }}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <label className="text-foreground">Safety</label>
              <span className="text-accent font-medium">{(config.objectives.safety * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.objectives.safety}
              onChange={(e) => {
                const newVal = parseFloat(e.target.value)
                const remaining = 1 - newVal
                const timeRatio = config.objectives.time / (config.objectives.time + config.objectives.cost)
                setConfig({
                  ...config,
                  objectives: {
                    time: remaining * timeRatio,
                    cost: remaining * (1 - timeRatio),
                    safety: newVal,
                  },
                })
              }}
              className="w-full"
            />
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="border-t border-border pt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            Advanced Settings
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label className="text-foreground">Population Size</label>
                  <span className="text-accent font-medium">{config.population_size}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={config.population_size}
                  onChange={(e) => setConfig({ ...config, population_size: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label className="text-foreground">Max Generations</label>
                  <span className="text-accent font-medium">{config.max_generations}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={config.max_generations}
                  onChange={(e) => setConfig({ ...config, max_generations: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label className="text-foreground">Mutation Rate</label>
                  <span className="text-accent font-medium">{config.mutation_rate.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={config.mutation_rate}
                  onChange={(e) => setConfig({ ...config, mutation_rate: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Optimize Button */}
        <Button
          onClick={onOptimize}
          disabled={loading}
          className="w-full mt-6"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Optimizing...
            </>
          ) : (
            'Optimize Route'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
