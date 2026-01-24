'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Loader2, Download, Maximize2, Minimize2, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-muted rounded-lg animate-pulse" />,
})

const DynamicMultiRouteMap = dynamic(() => import('./multi-route-map'), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-muted rounded-lg animate-pulse" />,
})

const API_BASE = 'https://navaigator.onrender.com'

interface SimulationComparisonProps {
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
    alternative_routes: Array<{
      time_priority: number
      cost_priority: number
      safety_priority: number
      distance: number
      time: number
      cost: number
      safety_risk: number
      waypoints: number
    }>
    weather_data: Array<[number, number, number]>
    piracy_data: Array<{
      location: [number, number]
      intensity: number
    }>
  }
  shipType: string
}

export function SimulationComparison({ routeData, shipType }: SimulationComparisonProps) {
  const [simulationData, setSimulationData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [fullscreenChart, setFullscreenChart] = useState<string | null>(null)
  const [weatherFactor, setWeatherFactor] = useState(0.3)
  const [piracyFactor, setPiracyFactor] = useState(0.3)
  const [fuelMultiplier, setFuelMultiplier] = useState(1.0)

  const metricsChartRef = useRef<HTMLDivElement | null>(null)
  const priorityChartRef = useRef<HTMLDivElement | null>(null)
  const simulationChartRef = useRef<HTMLDivElement | null>(null)

  // Format helpers
  const formatTime = (hours: number) => {
    const days = Math.floor(hours / 24)
    const remainingHours = Math.floor(hours % 24)
    if (days > 0) return `${days}d ${remainingHours}h`
    return `${remainingHours}h`
  }

  const formatDistance = (km: number) => {
    return `${km.toFixed(0)} km`
  }

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(0)}`
  }

  const handleSimulate = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          route: routeData.optimized_route,
          ship_params: {
            ship_type: shipType,
            fuel_efficiency: 0.8,
            max_speed: 20.0,
            cargo_capacity: 5000.0,
          },
          weather_factor: weatherFactor,
          piracy_factor: piracyFactor,
          fuel_cost_multiplier: fuelMultiplier,
        }),
      })
      const data = await response.json()
      setSimulationData(data)
      console.log('Simulation complete:', data)
    } catch (error) {
      console.error('Simulation error:', error)
      alert('Failed to run simulation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Download chart as PNG
  const downloadChartAsPNG = async (chartRef: React.RefObject<HTMLDivElement | null>, filename: string) => {
    if (!chartRef.current) return

    setDownloading(filename)
    try {
      const svgElement = chartRef.current.querySelector('svg')
      if (!svgElement) throw new Error('No SVG found')

      const bbox = svgElement.getBBox()
      const width = bbox.width || 800
      const height = bbox.height || 400

      const canvas = document.createElement('canvas')
      canvas.width = width * 2
      canvas.height = height * 2
      const ctx = canvas.getContext('2d')
      
      if (!ctx) throw new Error('Could not get canvas context')

      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(2, 2)

      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svgElement)
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)

      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        URL.revokeObjectURL(url)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = pngUrl
            link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.png`
            link.click()
            URL.revokeObjectURL(pngUrl)
          }
          setDownloading(null)
        })
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        throw new Error('Failed to load SVG as image')
      }
      img.src = url
    } catch (error) {
      console.error('Error downloading chart:', error)
      alert('Failed to download chart. Please try again.')
      setDownloading(null)
    }
  }

  const toggleFullscreen = (chartId: string) => {
    setFullscreenChart(fullscreenChart === chartId ? null : chartId)
  }

  // Prepare alternative routes with main route
  const allRoutes = [
    {
      name: 'Primary Route',
      time_priority: routeData.fitness.time ? 1 : 0,
      cost_priority: routeData.fitness.cost ? 1 : 0,
      safety_priority: routeData.fitness.safety ? 1 : 0,
      distance: routeData.total_distance,
      time: routeData.fitness.time,
      cost: routeData.fitness.cost,
      safety_risk: routeData.fitness.safety,
      waypoints: routeData.optimized_route.length,
    },
    ...routeData.alternative_routes.map((route, idx) => ({
      ...route,
      name: `Alt Route ${idx + 1}`,
    })),
  ]

  // Prepare data for all routes comparison
  const routeMetricsData = allRoutes.map((route) => ({
    name: route.name,
    distance: parseFloat(route.distance.toFixed(0)),
    time: parseFloat(route.time.toFixed(1)),
    cost: parseFloat(route.cost.toFixed(0)),
    safety: parseFloat((route.safety_risk * 100).toFixed(1)),
  }))

  // Prepare radar data for optimization priorities
  const radarData = allRoutes.map((route, idx) => ({
    route: `Route ${idx + 1}`,
    time: parseFloat((route.time_priority * 100).toFixed(1)),
    cost: parseFloat((route.cost_priority * 100).toFixed(1)),
    safety: parseFloat((route.safety_priority * 100).toFixed(1)),
  }))

  // Comparison data for simulation
  const comparisonData = simulationData?.comparison_data
    ? [
        {
          metric: 'Time (h)',
          original: parseFloat(routeData.fitness.time.toFixed(1)),
          simulated: parseFloat(simulationData.comparison_data[0].Simulated.toFixed(1)),
          change: parseFloat(simulationData.comparison_data[0]['Change (%)'].toFixed(1)),
        },
        {
          metric: 'Cost ($)',
          original: parseFloat(routeData.fitness.cost.toFixed(0)),
          simulated: parseFloat(simulationData.comparison_data[1].Simulated.toFixed(0)),
          change: parseFloat(simulationData.comparison_data[1]['Change (%)'].toFixed(1)),
        },
        {
          metric: 'Safety Risk',
          original: parseFloat((routeData.fitness.safety * 100).toFixed(1)),
          simulated: parseFloat((simulationData.comparison_data[2].Simulated * 100).toFixed(1)),
          change: parseFloat(simulationData.comparison_data[2]['Change (%)'].toFixed(1)),
        },
      ]
    : []

  // Prepare simulated route data for map
  const simulatedRouteData = simulationData ? {
    ...routeData,
    weather_data: simulationData.updated_weather || routeData.weather_data,
    piracy_data: simulationData.updated_piracy || routeData.piracy_data,
  } : routeData

  return (
    <Tabs defaultValue="comparison" className="space-y-6">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="comparison">Route Comparison</TabsTrigger>
        <TabsTrigger value="simulation">Simulation</TabsTrigger>
        <TabsTrigger value="map">Multi-Route Map</TabsTrigger>
      </TabsList>

      <TabsContent value="comparison" className="space-y-6">
        {/* All Routes Metrics Comparison */}
        <Card className={fullscreenChart === 'metrics' ? 'fixed inset-0 z-50 m-4' : ''}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Routes Metrics Comparison</CardTitle>
              <CardDescription>Compare distance, time, cost, and safety across all routes</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFullscreen('metrics')}
                className="gap-2"
              >
                {fullscreenChart === 'metrics' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadChartAsPNG(metricsChartRef, 'route-metrics')}
                disabled={downloading === 'route-metrics'}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                {downloading === 'route-metrics' ? '...' : 'PNG'}
              </Button>
            </div>
          </CardHeader>
          <CardContent ref={metricsChartRef}>
            <ResponsiveContainer width="100%" height={fullscreenChart === 'metrics' ? 600 : 400}>
              <BarChart data={routeMetricsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fill: 'currentColor', fontSize: 12 }} label={{ value: 'Distance (km) & Time (h)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'currentColor', fontSize: 12 }} label={{ value: 'Cost ($) & Safety (%)', angle: 90, position: 'insideRight' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar dataKey="distance" fill="#3b82f6" name="Distance (km)" yAxisId="left" radius={[4, 4, 0, 0]} />
                <Bar dataKey="time" fill="#8b5cf6" name="Time (h)" yAxisId="left" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" fill="#ec4899" name="Cost ($)" yAxisId="right" radius={[4, 4, 0, 0]} />
                <Bar dataKey="safety" fill="#f59e0b" name="Safety Risk (%)" yAxisId="right" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Route Optimization Priority Radar */}
        <Card className={fullscreenChart === 'priority' ? 'fixed inset-0 z-50 m-4' : ''}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Route Optimization Priorities</CardTitle>
              <CardDescription>Weighted optimization goals for each route</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFullscreen('priority')}
                className="gap-2"
              >
                {fullscreenChart === 'priority' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadChartAsPNG(priorityChartRef, 'optimization-priorities')}
                disabled={downloading === 'optimization-priorities'}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                {downloading === 'optimization-priorities' ? '...' : 'PNG'}
              </Button>
            </div>
          </CardHeader>
          <CardContent ref={priorityChartRef}>
            <ResponsiveContainer width="100%" height={fullscreenChart === 'priority' ? 600 : 400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="route" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <PolarRadiusAxis tick={{ fill: 'currentColor', fontSize: 11 }} angle={90} domain={[0, 100]} />
                <Radar name="Time Priority" dataKey="time" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                <Radar name="Cost Priority" dataKey="cost" stroke="#ec4899" fill="#ec4899" fillOpacity={0.25} />
                <Radar name="Safety Priority" dataKey="safety" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Route Comparison Table</CardTitle>
            <CardDescription>Complete metrics for all available routes</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Route</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Distance</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Est. Time</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Est. Cost</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Safety Risk</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Waypoints</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Time Priority</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Cost Priority</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Safety Priority</th>
                </tr>
              </thead>
              <tbody>
                {allRoutes.map((route, idx) => (
                  <tr key={idx} className={`border-b border-border ${idx === 0 ? 'bg-primary/5' : ''}`}>
                    <td className="py-3 px-4 font-medium text-foreground">{route.name}</td>
                    <td className="text-right py-3 px-4 text-muted-foreground">{formatDistance(route.distance)}</td>
                    <td className="text-right py-3 px-4 text-muted-foreground">{formatTime(route.time)}</td>
                    <td className="text-right py-3 px-4 text-muted-foreground">{formatCost(route.cost)}</td>
                    <td className="text-right py-3 px-4">
                      <span className={`font-semibold ${
                        route.safety_risk > 0.5 ? 'text-red-600 dark:text-red-400' :
                        route.safety_risk > 0.3 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {(route.safety_risk * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 text-muted-foreground">{route.waypoints}</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">{(route.time_priority * 100).toFixed(0)}%</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">{(route.cost_priority * 100).toFixed(0)}%</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">{(route.safety_priority * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="simulation" className="space-y-6">
        {/* Simulation Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Scenario Simulation</CardTitle>
            <CardDescription>Test route performance under different conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Weather Impact Factor</label>
                  <span className="text-accent font-medium">{weatherFactor.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weatherFactor}
                  onChange={(e) => setWeatherFactor(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Piracy Risk Factor</label>
                  <span className="text-accent font-medium">{piracyFactor.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={piracyFactor}
                  onChange={(e) => setPiracyFactor(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Fuel Cost Multiplier</label>
                  <span className="text-accent font-medium">{fuelMultiplier.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={fuelMultiplier}
                  onChange={(e) => setFuelMultiplier(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              onClick={handleSimulate}
              disabled={loading}
              className="w-full gap-2"
              size="lg"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Simulating...' : 'Run Simulation'}
            </Button>
          </CardContent>
        </Card>

        {/* Simulation Results */}
        {simulationData && (
          <>
            <Card className={fullscreenChart === 'simulation' ? 'fixed inset-0 z-50 m-4' : ''}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Simulation Results</CardTitle>
                  <CardDescription>Route metrics comparison before and after simulation</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFullscreen('simulation')}
                    className="gap-2"
                  >
                    {fullscreenChart === 'simulation' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadChartAsPNG(simulationChartRef, 'simulation-results')}
                    disabled={downloading === 'simulation-results'}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {downloading === 'simulation-results' ? '...' : 'PNG'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent ref={simulationChartRef}>
                <ResponsiveContainer width="100%" height={fullscreenChart === 'simulation' ? 600 : 300}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="metric" tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="original" fill="#8b5cf6" name="Original Route" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="simulated" fill="#3b82f6" name="Simulated Conditions" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Simulation Summary */}
            <div className="grid md:grid-cols-3 gap-4">
              {comparisonData.map((item, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">{item.metric}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Original</p>
                        <p className="text-xl font-bold text-foreground">{item.original}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">After Simulation</p>
                        <p className="text-xl font-bold text-foreground">{item.simulated}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Change</p>
                        <p className={`text-lg font-semibold ${item.change < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Simulation Map View */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Simulated Route with Updated Risk Zones
                </CardTitle>
                <CardDescription>Map showing route with updated weather and piracy risks after simulation</CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicMap routeData={simulatedRouteData} />
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> The map now shows updated weather patterns and piracy hotspots based on your simulation parameters 
                    (Weather Factor: {weatherFactor.toFixed(2)}, Piracy Factor: {piracyFactor.toFixed(2)}, Fuel Multiplier: {fuelMultiplier.toFixed(2)}x).
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </TabsContent>

      <TabsContent value="map" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Multi-Route Visualization
            </CardTitle>
            <CardDescription>Click on route buttons to see each route separately on the map</CardDescription>
          </CardHeader>
          <CardContent>
            <DynamicMultiRouteMap routeData={routeData} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}