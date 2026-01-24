'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Copy, AlertCircle, TrendingDown, Clock, DollarSign } from 'lucide-react'

interface RouteSummaryProps {
  routeData: {
    optimized_route: Array<{
      name: string
      latitude: number
      longitude: number
      weather_risk: number
      piracy_risk: number
      maritime_traffic: number
    }>
    fitness: {
      time: number
      cost: number
      safety: number
    }
    total_distance: number
  }
  config: {
    start_port: string
    end_port: string
    ship_type: string
    objectives: {
      time: number
      cost: number
      safety: number
    }
  }
}

function formatTime(hours: number): string {
  const days = Math.floor(hours / 24)
  const remaining = Math.floor(hours % 24)
  if (days > 0) return `${days}d ${remaining}h`
  return `${remaining}h`
}

export function RouteSummary({ routeData, config }: RouteSummaryProps) {
  const avgWeatherRisk =
    routeData.optimized_route.reduce((sum, wp) => sum + wp.weather_risk, 0) / routeData.optimized_route.length
  const avgPiracyRisk =
    routeData.optimized_route.reduce((sum, wp) => sum + wp.piracy_risk, 0) / routeData.optimized_route.length

  const handleExport = () => {
    const summary = {
      route: {
        start: config.start_port,
        end: config.end_port,
        waypoints: routeData.optimized_route.length,
        distance: routeData.total_distance.toFixed(2) + ' km',
      },
      ship: config.ship_type,
      performance: {
        estimatedTime: formatTime(routeData.fitness.time),
        estimatedCost: '$' + routeData.fitness.cost.toFixed(2),
        safetyRisk: (routeData.fitness.safety * 100).toFixed(1) + '%',
      },
      objectives: {
        time: (config.objectives.time * 100).toFixed(0) + '%',
        cost: (config.objectives.cost * 100).toFixed(0) + '%',
        safety: (config.objectives.safety * 100).toFixed(0) + '%',
      },
      waypoints: routeData.optimized_route.map((wp) => ({
        name: wp.name,
        coords: `${wp.latitude.toFixed(4)}, ${wp.longitude.toFixed(4)}`,
        weatherRisk: (wp.weather_risk * 100).toFixed(1) + '%',
        piracyRisk: (wp.piracy_risk * 100).toFixed(1) + '%',
        trafficRisk: (wp.maritime_traffic * 100).toFixed(1) + '%',
      })),
    }

    const dataStr = JSON.stringify(summary, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `route-summary-${Date.now()}.json`
    link.click()
  }

  const handleCopyRoute = () => {
    const routeText = routeData.optimized_route.map((wp) => wp.name).join(' → ')
    navigator.clipboard.writeText(routeText)
  }

  return (
    <div className="space-y-6">
      {/* Route Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Route Overview</CardTitle>
          <CardDescription>Complete route summary and performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Route Path */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground">Optimized Route</h3>
              <Button size="sm" variant="ghost" onClick={handleCopyRoute} className="gap-2">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-sm font-medium text-foreground">
              {routeData.optimized_route.map((wp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground">
                    {wp.name}
                  </span>
                  {idx < routeData.optimized_route.length - 1 && <span className="text-muted-foreground">→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm font-medium text-muted-foreground">Total Distance</h4>
                <TrendingDown className="w-4 h-4 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">{routeData.total_distance.toFixed(0)} km</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm font-medium text-muted-foreground">Est. Travel Time</h4>
                <Clock className="w-4 h-4 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">{formatTime(routeData.fitness.time)}</p>
              <p className="text-xs text-muted-foreground mt-1">{routeData.fitness.time.toFixed(1)} hours</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm font-medium text-muted-foreground">Est. Cost</h4>
                <DollarSign className="w-4 h-4 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">${routeData.fitness.cost.toFixed(0)}</p>
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground mb-3">Configuration</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ship Type:</span>
                  <span className="font-medium text-foreground">{config.ship_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Waypoints:</span>
                  <span className="font-medium text-foreground">{routeData.optimized_route.length}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground mb-3">Optimization Priorities</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium text-foreground">{(config.objectives.time * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cost:</span>
                  <span className="font-medium text-foreground">{(config.objectives.cost * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Safety:</span>
                  <span className="font-medium text-foreground">{(config.objectives.safety * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent" />
            Risk Assessment
          </CardTitle>
          <CardDescription>Average risk metrics across the route</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Avg Weather Risk</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {(avgWeatherRisk * 100).toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div
                  className="bg-yellow-500 h-full rounded-full transition-all"
                  style={{ width: `${avgWeatherRisk * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Avg Piracy Risk</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {(avgPiracyRisk * 100).toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div
                  className="bg-red-500 h-full rounded-full transition-all"
                  style={{ width: `${avgPiracyRisk * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Safety Risk</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {(routeData.fitness.safety * 100).toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all"
                  style={{ width: `${routeData.fitness.safety * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Waypoints Details */}
      <Card>
        <CardHeader>
          <CardTitle>Waypoint Details</CardTitle>
          <CardDescription>Complete information for each port on the route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-3 font-semibold text-foreground">Port</th>
                  <th className="text-right p-3 font-semibold text-foreground">Latitude</th>
                  <th className="text-right p-3 font-semibold text-foreground">Longitude</th>
                  <th className="text-right p-3 font-semibold text-foreground">Weather</th>
                  <th className="text-right p-3 font-semibold text-foreground">Piracy</th>
                  <th className="text-right p-3 font-semibold text-foreground">Traffic</th>
                </tr>
              </thead>
              <tbody>
                {routeData.optimized_route.map((wp, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{wp.name}</td>
                    <td className="text-right p-3 text-muted-foreground font-mono text-xs">
                      {wp.latitude.toFixed(4)}
                    </td>
                    <td className="text-right p-3 text-muted-foreground font-mono text-xs">
                      {wp.longitude.toFixed(4)}
                    </td>
                    <td className="text-right p-3">
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs font-medium">
                        {(wp.weather_risk * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="text-right p-3">
                      <span className="px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-xs font-medium">
                        {(wp.piracy_risk * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="text-right p-3">
                      <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 text-xs font-medium">
                        {(wp.maritime_traffic * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export Button */}
      <div className="flex gap-3">
        <Button onClick={handleExport} className="gap-2" size="lg">
          <Download className="w-4 h-4" />
          Export Summary as JSON
        </Button>
      </div>
    </div>
  )
}
