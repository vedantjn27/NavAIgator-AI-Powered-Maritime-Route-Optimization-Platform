'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Maximize2, Minimize2, Camera } from 'lucide-react'
import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-muted rounded-lg animate-pulse" />,
})

interface MapVisualizationProps {
  routeData: {
    optimized_route: Array<{
      name: string
      latitude: number
      longitude: number
      weather_risk: number
      piracy_risk: number
      maritime_traffic: number
    }>
    weather_data: Array<[number, number, number]>
    piracy_data: Array<{
      location: [number, number]
      intensity: number
    }>
    fitness: {
      time: number
      cost: number
      safety: number
    }
    total_distance: number
  }
}

export function MapVisualization({ routeData }: MapVisualizationProps) {
  const [downloading, setDownloading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Calculate route metrics
  const totalDistance = routeData.total_distance || 0
  const estimatedTime = routeData.fitness?.time || 0
  const estimatedCost = routeData.fitness?.cost || 0
  const safetyRisk = routeData.fitness?.safety || 0
  const waypointCount = routeData.optimized_route.length

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
    return `${cost.toFixed(0)}`
  }

  // Download map using browser's native screenshot or print
  const handleDownload = async () => {
    setDownloading(true)
    try {
      // Wait for map to fully render
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (mapContainerRef.current) {
        // Get all the styles from the current document
        const styles = Array.from(document.styleSheets)
          .map(styleSheet => {
            try {
              return Array.from(styleSheet.cssRules)
                .map(rule => rule.cssText)
                .join('\n')
            } catch (e) {
              return ''
            }
          })
          .join('\n')
        
        // Get the map container HTML
        const mapHtml = mapContainerRef.current.innerHTML
        
        // Create a new window with the map
        const printWindow = window.open('', '_blank', 'width=1200,height=800')
        
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Route Map - ${new Date().toLocaleDateString()}</title>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <style>
                  * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                  }
                  body {
                    font-family: system-ui, -apple-system, sans-serif;
                    padding: 20px;
                    background: white;
                  }
                  .leaflet-container {
                    width: 100%;
                    height: 600px !important;
                  }
                  ${styles}
                  @media print {
                    body { padding: 0; }
                    .leaflet-container { 
                      height: 100vh !important;
                      page-break-inside: avoid;
                    }
                  }
                </style>
              </head>
              <body>
                <h1 style="margin-bottom: 20px;">Maritime Route Map</h1>
                <div style="margin-bottom: 20px;">
                  <strong>Generated:</strong> ${new Date().toLocaleString()}
                </div>
                ${mapHtml}
                <script>
                  // Wait a bit for leaflet tiles to load
                  setTimeout(function() {
                    window.print();
                    // Close after printing (optional)
                    // setTimeout(function() { window.close(); }, 100);
                  }, 2000);
                </script>
              </body>
            </html>
          `)
          printWindow.document.close()
        } else {
          throw new Error('Could not open print window. Please check your popup blocker.')
        }
      }
    } catch (error) {
      console.error('Error printing map:', error)
      alert('Unable to print map. Please try using your browser\'s screenshot tool or right-click on the map and select "Print".')
    } finally {
      setDownloading(false)
    }
  }

  // Alternative: Download route data as JSON
  const handleDownloadData = () => {
    const dataStr = JSON.stringify(routeData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `route-data-${new Date().toISOString().slice(0, 10)}.json`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    if (!mapContainerRef.current) return

    try {
      if (!document.fullscreenElement) {
        await mapContainerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
      // Fallback: just maximize the container
      if (mapContainerRef.current) {
        mapContainerRef.current.classList.toggle('fixed')
        mapContainerRef.current.classList.toggle('inset-0')
        mapContainerRef.current.classList.toggle('z-50')
        mapContainerRef.current.classList.toggle('bg-background')
        setIsFullscreen(!isFullscreen)
      }
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Route Visualization</CardTitle>
            <CardDescription>Interactive map showing optimized route with risk zones</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="gap-2"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  Exit
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  Fullscreen
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={downloading}
              className="gap-2"
              title="Print/Save as PDF"
            >
              <Camera className="w-4 h-4" />
              {downloading ? 'Opening...' : 'Print'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadData}
              className="gap-2"
              title="Download route data as JSON"
            >
              <Download className="w-4 h-4" />
              Data
            </Button>
          </div>
        </CardHeader>
        <CardContent 
          ref={mapContainerRef}
          className={isFullscreen ? 'h-screen flex flex-col p-4' : ''}
        >
          <div className={isFullscreen ? 'flex-1' : ''}>
            <DynamicMap routeData={routeData} />
          </div>
          
          {/* Legend */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-foreground">Start Port</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-foreground">Waypoint</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-foreground">End Port</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500 opacity-60"></div>
              <span className="text-foreground">Risk Zone</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Summary Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatDistance(totalDistance)}</div>
            <p className="text-xs text-muted-foreground mt-2">{waypointCount} waypoints</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Est. Travel Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatTime(estimatedTime)}</div>
            <p className="text-xs text-muted-foreground mt-2">{estimatedTime.toFixed(1)} hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Est. Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{formatCost(estimatedCost)}</div>
            <p className="text-xs text-muted-foreground mt-2">{estimatedCost.toFixed(0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Safety Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{(safetyRisk * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-2">Combined risk score</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}