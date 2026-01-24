'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Maximize2, Minimize2, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

interface RiskAnalysisDashboardProps {
  routeData: {
    optimized_route: Array<{
      name: string
      latitude: number
      longitude: number
      weather_risk: number
      piracy_risk: number
      maritime_traffic: number
    }>
    generation_data: Array<{
      generation: number
      best_fitness: number
      avg_fitness: number
    }>
    fitness: {
      time: number
      cost: number
      safety: number
    }
  }
}

export function RiskAnalysisDashboard({ routeData }: RiskAnalysisDashboardProps) {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [fullscreenChart, setFullscreenChart] = useState<string | null>(null)
  
  const riskChartRef = useRef<HTMLDivElement | null>(null)
  const progressChartRef = useRef<HTMLDivElement | null>(null)
  const radarChartRef = useRef<HTMLDivElement | null>(null)

  // Format time helper
  const formatTime = (hours: number) => {
    const days = Math.floor(hours / 24)
    const remainingHours = Math.floor(hours % 24)
    if (days > 0) return `${days}d ${remainingHours}h`
    return `${remainingHours}h`
  }

  // Calculate risk data for each waypoint
  const riskData = routeData.optimized_route.map((wp, idx) => ({
    name: wp.name,
    order: idx,
    weather: parseFloat((wp.weather_risk * 100).toFixed(1)),
    piracy: parseFloat((wp.piracy_risk * 100).toFixed(1)),
    traffic: parseFloat((wp.maritime_traffic * 100).toFixed(1)),
    total: parseFloat(
      ((wp.weather_risk * 0.4 + wp.piracy_risk * 0.4 + wp.maritime_traffic * 0.2) * 100).toFixed(1)
    ),
  }))

  // Find highest risk waypoint
  const highestRiskIdx = riskData.reduce((maxIdx, current, idx) => 
    current.total > riskData[maxIdx].total ? idx : maxIdx, 0)
  const highestRiskPoint = riskData[highestRiskIdx]

  // Calculate ETA for each waypoint based on cumulative distance
  const totalTravelHours = routeData.fitness?.time || 0
  const hoursPerWaypoint = totalTravelHours / Math.max(riskData.length - 1, 1)
  
  const cumulativeETA = riskData.map((point, idx) => {
    const etaHours = hoursPerWaypoint * idx
    return {
      ...point,
      etaHours: etaHours,
      etaFormatted: formatTime(etaHours),
    }
  })

  // Download chart as SVG
  const downloadChartAsSVG = async (chartRef: React.RefObject<HTMLDivElement | null>, filename: string) => {
    if (!chartRef.current) return

    setDownloading(filename)
    try {
      // Find the SVG element
      const svgElement = chartRef.current.querySelector('svg')
      if (!svgElement) {
        throw new Error('No SVG found in chart')
      }

      // Clone the SVG
      const clonedSvg = svgElement.cloneNode(true) as SVGElement
      
      // Set white background
      clonedSvg.setAttribute('style', 'background-color: white;')
      
      // Serialize SVG to string
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(clonedSvg)
      
      // Create blob and download
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.svg`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading chart:', error)
      alert('Failed to download chart. Please try the print option instead.')
    } finally {
      setDownloading(null)
    }
  }

  // Download chart as PNG using canvas
  const downloadChartAsPNG = async (chartRef: React.RefObject<HTMLDivElement | null>, filename: string) => {
    if (!chartRef.current) return

    setDownloading(filename)
    try {
      const svgElement = chartRef.current.querySelector('svg')
      if (!svgElement) throw new Error('No SVG found')

      // Get SVG dimensions
      const bbox = svgElement.getBBox()
      const width = bbox.width || 800
      const height = bbox.height || 400

      // Create canvas
      const canvas = document.createElement('canvas')
      canvas.width = width * 2 // 2x for better quality
      canvas.height = height * 2
      const ctx = canvas.getContext('2d')
      
      if (!ctx) throw new Error('Could not get canvas context')

      // White background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(2, 2)

      // Convert SVG to image
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svgElement)
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)

      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        URL.revokeObjectURL(url)
        
        // Download as PNG
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
      // Fallback to SVG download
      downloadChartAsSVG(chartRef, filename)
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = (chartId: string) => {
    setFullscreenChart(fullscreenChart === chartId ? null : chartId)
  }

  // Prepare generation data for optimization progress
  const generationData = routeData.generation_data.map((gen) => ({
    ...gen,
    best_fitness: parseFloat(gen.best_fitness.toFixed(2)),
    avg_fitness: parseFloat(gen.avg_fitness.toFixed(2)),
  }))

  // Prepare fitness radar data
  const fitnessData = [
    {
      metric: 'Time',
      value: parseFloat((100 - Math.min(routeData.fitness.time, 100)).toFixed(1)),
      fullMark: 100,
    },
    {
      metric: 'Cost',
      value: parseFloat((100 - Math.min(routeData.fitness.cost, 100)).toFixed(1)),
      fullMark: 100,
    },
    {
      metric: 'Safety',
      value: parseFloat(((1 - routeData.fitness.safety) * 100).toFixed(1)),
      fullMark: 100,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Highest Risk Alert */}
      {highestRiskPoint && highestRiskPoint.total > 50 && (
        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardContent className="pt-6 flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-700 dark:text-orange-400">High Risk Zone Detected</h3>
              <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
                <strong>{highestRiskPoint.name}</strong> has the highest combined risk score of <strong>{highestRiskPoint.total.toFixed(1)}%</strong>
              </p>
              <p className="text-xs text-orange-500 dark:text-orange-400 mt-2">
                Weather: {highestRiskPoint.weather.toFixed(1)}% | Piracy: {highestRiskPoint.piracy.toFixed(1)}% | Traffic: {highestRiskPoint.traffic.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk by Waypoint with Download & Fullscreen */}
      <Card className={fullscreenChart === 'risk' ? 'fixed inset-0 z-50 m-4' : ''}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Risk Analysis by Waypoint</CardTitle>
            <CardDescription>Weather, piracy, and traffic risk assessment for each port</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleFullscreen('risk')}
              className="gap-2"
            >
              {fullscreenChart === 'risk' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadChartAsPNG(riskChartRef, 'risk-analysis')}
              disabled={downloading === 'risk-analysis'}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {downloading === 'risk-analysis' ? 'Downloading...' : 'PNG'}
            </Button>
          </div>
        </CardHeader>
        <CardContent ref={riskChartRef}>
          <ResponsiveContainer width="100%" height={fullscreenChart === 'risk' ? 600 : 300}>
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fill: 'currentColor', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Bar dataKey="weather" fill="#fbbf24" name="Weather Risk %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="piracy" fill="#ef4444" name="Piracy Risk %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="traffic" fill="#8b5cf6" name="Traffic Risk %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Optimization Progress */}
        <Card className={fullscreenChart === 'progress' ? 'fixed inset-0 z-50 m-4' : ''}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Optimization Progress</CardTitle>
              <CardDescription>Fitness improvement over generations</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFullscreen('progress')}
                className="gap-2"
              >
                {fullscreenChart === 'progress' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadChartAsPNG(progressChartRef, 'optimization-progress')}
                disabled={downloading === 'optimization-progress'}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                {downloading === 'optimization-progress' ? '...' : 'PNG'}
              </Button>
            </div>
          </CardHeader>
          <CardContent ref={progressChartRef}>
            <ResponsiveContainer width="100%" height={fullscreenChart === 'progress' ? 600 : 250}>
              <LineChart data={generationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="generation"
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  label={{ value: 'Generation', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} label={{ value: 'Fitness Score', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="best_fitness"
                  stroke="#3b82f6"
                  dot={false}
                  name="Best Fitness"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="avg_fitness"
                  stroke="#94a3b8"
                  dot={false}
                  name="Avg Fitness"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fitness Radar */}
        <Card className={fullscreenChart === 'radar' ? 'fixed inset-0 z-50 m-4' : ''}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Route Quality Metrics</CardTitle>
              <CardDescription>Multi-dimensional fitness assessment</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFullscreen('radar')}
                className="gap-2"
              >
                {fullscreenChart === 'radar' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadChartAsPNG(radarChartRef, 'quality-metrics')}
                disabled={downloading === 'quality-metrics'}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                {downloading === 'quality-metrics' ? '...' : 'PNG'}
              </Button>
            </div>
          </CardHeader>
          <CardContent ref={radarChartRef}>
            <ResponsiveContainer width="100%" height={fullscreenChart === 'radar' ? 600 : 250}>
              <RadarChart data={fitnessData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <PolarRadiusAxis tick={{ fill: 'currentColor', fontSize: 11 }} />
                <Radar
                  name="Quality Score"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Total Risk Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Total Risk by Waypoint with ETA</CardTitle>
          <CardDescription>Combined weighted risk score and estimated arrival times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cumulativeETA.map((waypoint, idx) => (
              <div key={idx} className="space-y-2 pb-4 border-b last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground">{waypoint.name}</span>
                    <p className="text-xs text-muted-foreground mt-1">ETA: {waypoint.etaFormatted} ({waypoint.etaHours.toFixed(1)}h)</p>
                  </div>
                  {waypoint.total > 70 && (
                    <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">
                      HIGH RISK
                    </span>
                  )}
                  {waypoint.total > 40 && waypoint.total <= 70 && (
                    <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
                      MODERATE
                    </span>
                  )}
                  {waypoint.total <= 40 && (
                    <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                      LOW RISK
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-full transition-all"
                      style={{ width: `${waypoint.total}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-accent w-12 text-right">{waypoint.total.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}