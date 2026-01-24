'use client'

import { useState, useEffect } from 'react'
import { Header } from './header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapVisualization } from './map-visualization'
import { RiskAnalysisDashboard } from './risk-analysis-dashboard'
import { SimulationComparison } from './simulation-comparison'
import { RouteSummary } from './route-summary'
import { RouteConfig } from './route-config'
import { Home, Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'

const API_BASE = 'https://navaigator.onrender.com'

interface RouteData {
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
  total_distance: number
  weather_data: Array<[number, number, number]>
  piracy_data: Array<{
    location: [number, number]
    intensity: number
  }>
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
}

interface PortData {
  name: string
  latitude: number
  longitude: number
}

export function RouteOptimizer() {
  const [ports, setPorts] = useState<PortData[]>([])
  const [shipTypes, setShipTypes] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [routeData, setRouteData] = useState<RouteData | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [config, setConfig] = useState({
    start_port: 'Chennai',
    end_port: 'Mumbai',
    ship_type: 'Cargo',
    population_size: 100,
    max_generations: 50,
    mutation_rate: 0.1,
    objectives: {
      time: 0.4,
      cost: 0.3,
      safety: 0.3,
    },
  })

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch ports and ship types on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [portsRes, shipsRes] = await Promise.all([
          fetch(`${API_BASE}/ports`),
          fetch(`${API_BASE}/ship-types`),
        ])
        const portsData = await portsRes.json()
        const shipsData = await shipsRes.json()
        setPorts(portsData)
        setShipTypes(shipsData)
      } catch (error) {
        console.error('[v0] Error fetching initial data:', error)
      }
    }
    fetchInitialData()
  }, [])

  const handleOptimize = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_port: config.start_port,
          end_port: config.end_port,
          ship_type: config.ship_type,
          population_size: config.population_size,
          max_generations: config.max_generations,
          mutation_rate: config.mutation_rate,
          objectives: config.objectives,
        }),
      })
      const data = await response.json()
      setRouteData(data)
      console.log('[v0] Route optimization complete:', data)
    } catch (error) {
      console.error('[v0] Optimization error:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = mounted && currentTheme === 'dark'

  if (!routeData) {
    return (
      <div className="min-h-screen bg-background relative">
        {/* Background Image with Theme Support and Parallax - Fixed Position */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          {mounted && (
            <>
              <div 
                className="absolute inset-0 transition-transform duration-75 ease-out will-change-transform bg-cover bg-center"
                style={{ 
                  transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
                  backgroundImage: 'url(/images/maritime-port.jpg)',
                }}
              />
              <div className={`absolute inset-0 transition-opacity duration-500 ${
                isDark 
                  ? 'bg-gradient-to-b from-black/70 via-black/50 to-black/70' 
                  : 'bg-gradient-to-b from-white/80 via-white/70 to-white/80'
              }`} />
            </>
          )}
        </div>
        
        <Header />
        
        <main className="pt-20 max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <RouteConfig
                config={config}
                setConfig={setConfig}
                ports={ports}
                shipTypes={shipTypes}
                loading={loading}
                onOptimize={handleOptimize}
              />
            </div>
            
            <div className="lg:col-span-2">
              <Card className="border-dashed backdrop-blur-sm bg-background/95">
                <CardHeader>
                  <CardTitle>Ready to Optimize</CardTitle>
                  <CardDescription>
                    Configure your route parameters and click "Optimize Route" to begin
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center">
                  {loading ? (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-muted-foreground">Optimizing route...</p>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <p className="text-lg font-medium mb-2">No route optimized yet</p>
                      <p>Select your preferences and click optimize to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Image with Theme Support and Parallax - Fixed Position */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {mounted && (
          <>
            <div 
              className="absolute inset-0 transition-transform duration-75 ease-out will-change-transform bg-cover bg-center"
              style={{ 
                transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
                backgroundImage: 'url(/maritime-port.jpg)',
              }}
            />
            <div className={`absolute inset-0 transition-opacity duration-500 ${
              isDark 
                ? 'bg-gradient-to-b from-black/70 via-black/50 to-black/70' 
                : 'bg-gradient-to-b from-white/80 via-white/70 to-white/80'
            }`} />
          </>
        )}
      </div>
      
      <Header />
      
      <main className="pt-20 max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Route Optimization</h1>
            <p className="text-muted-foreground mt-2">
              {config.start_port} → {config.end_port} ({config.ship_type})
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setRouteData(null)
              window.scrollTo(0, 0)
            }}
          >
            New Optimization
          </Button>
        </div>

        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full backdrop-blur-sm bg-background/95">
            <TabsTrigger value="map">Route Map</TabsTrigger>
            <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <div className="backdrop-blur-sm bg-background/95 rounded-lg">
              <MapVisualization routeData={routeData} />
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="backdrop-blur-sm bg-background/95 rounded-lg">
              <RiskAnalysisDashboard routeData={routeData} />
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <div className="backdrop-blur-sm bg-background/95 rounded-lg">
              <SimulationComparison routeData={routeData} shipType={config.ship_type} />
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="backdrop-blur-sm bg-background/95 rounded-lg">
              <RouteSummary routeData={routeData} config={config} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}