'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from '@/components/ui/button'

interface MultiRouteMapProps {
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
}

interface RouteInfo {
  name: string
  color: string
  waypoints: Array<{
    name: string
    latitude: number
    longitude: number
    weather_risk: number
    piracy_risk: number
    maritime_traffic: number
  }>
}

export default function MultiRouteMap({ routeData }: MultiRouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<number>(0)
  const [allLayersGroup, setAllLayersGroup] = useState<L.FeatureGroup | null>(null)
  const routeLayers = useRef<Map<number, L.FeatureGroup>>(new Map())
  const weatherLayer = useRef<L.FeatureGroup | null>(null)
  const piracyLayer = useRef<L.FeatureGroup | null>(null)

  const routeColors = [
    '#3b82f6', // Primary route - blue
    '#10b981', // Alt 1 - green
    '#f59e0b', // Alt 2 - orange
    '#8b5cf6', // Alt 3 - purple
    '#ec4899', // Alt 4 - pink
  ]

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map
    map.current = L.map(mapContainer.current).setView([0, 20], 4)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current)

    // Create feature groups for layers
    const allLayers = L.featureGroup().addTo(map.current)
    setAllLayersGroup(allLayers)

    weatherLayer.current = L.featureGroup().addTo(map.current)
    piracyLayer.current = L.featureGroup().addTo(map.current)

    // Add weather data
    routeData.weather_data.forEach((weather) => {
      const intensity = Math.min(weather[2], 1)
      L.circleMarker([weather[0], weather[1]], {
        radius: 3 + intensity * 4,
        fillColor: '#fbbf24',
        color: 'transparent',
        fillOpacity: 0.2,
      }).addTo(weatherLayer.current!)
    })

    // Add piracy hotspots
    routeData.piracy_data.forEach((piracy) => {
      L.circleMarker(piracy.location, {
        radius: 4 + piracy.intensity * 6,
        fillColor: '#ef4444',
        color: 'transparent',
        fillOpacity: 0.2,
      })
        .bindPopup(
          `<div class="font-semibold">Piracy Hotspot</div>
           <div class="text-xs">Risk: ${(piracy.intensity * 100).toFixed(0)}%</div>`
        )
        .addTo(piracyLayer.current!)
    })

    // Primary route
    const primaryRoute = routeData.optimized_route
    const primaryGroup = L.featureGroup().addTo(allLayers)
    routeLayers.current.set(0, primaryGroup)

    const primaryCoords = primaryRoute.map((wp) => [wp.latitude, wp.longitude] as [number, number])
    L.polyline(primaryCoords, {
      color: routeColors[0],
      weight: 4,
      opacity: 1,
      smoothFactor: 1,
      dashArray: undefined,
    }).addTo(primaryGroup)

    primaryRoute.forEach((wp, idx) => {
      let color = routeColors[0]
      if (idx === 0) color = 'green'
      else if (idx === primaryRoute.length - 1) color = 'red'

      L.circleMarker([wp.latitude, wp.longitude], {
        radius: idx === 0 || idx === primaryRoute.length - 1 ? 8 : 6,
        fillColor: color,
        color: 'white',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .bindPopup(
          `<div class="font-semibold">${wp.name}</div>
           <div class="text-xs text-gray-600 mt-2">
             <div>Route: Primary</div>
             <div>Weather: ${(wp.weather_risk * 100).toFixed(0)}%</div>
             <div>Piracy: ${(wp.piracy_risk * 100).toFixed(0)}%</div>
             <div>Traffic: ${(wp.maritime_traffic * 100).toFixed(0)}%</div>
           </div>`,
          { maxWidth: 200 }
        )
        .bindTooltip(wp.name, {
          permanent: false,
          direction: 'top',
          offset: [0, -10],
        })
        .addTo(primaryGroup)
    })

    // Generate simulated alternative routes for visualization
    for (let i = 0; i < Math.min(4, routeData.alternative_routes.length); i++) {
      const altGroup = L.featureGroup()
      routeLayers.current.set(i + 1, altGroup)

      // Create a variation of the primary route for visualization
      const altRoute = primaryRoute.map((wp, idx) => ({
        ...wp,
        latitude: wp.latitude + (Math.random() - 0.5) * 3,
        longitude: wp.longitude + (Math.random() - 0.5) * 3,
      }))

      const altCoords = altRoute.map((wp) => [wp.latitude, wp.longitude] as [number, number])
      L.polyline(altCoords, {
        color: routeColors[i + 1],
        weight: 2,
        opacity: 0.4,
        smoothFactor: 1,
        dashArray: '5, 5',
      }).addTo(altGroup)

      altRoute.forEach((wp, idx) => {
        let color = routeColors[i + 1]
        if (idx === 0) color = 'green'
        else if (idx === altRoute.length - 1) color = 'red'

        L.circleMarker([wp.latitude, wp.longitude], {
          radius: idx === 0 || idx === altRoute.length - 1 ? 6 : 4,
          fillColor: color,
          color: 'white',
          weight: 1,
          opacity: 0.6,
          fillOpacity: 0.6,
        })
          .bindPopup(
            `<div class="font-semibold">${wp.name}</div>
             <div class="text-xs text-gray-600 mt-2">
               <div>Route: Alternative ${i + 1}</div>
               <div>Distance: ${routeData.alternative_routes[i]?.distance.toFixed(0)} km</div>
               <div>Time: ${routeData.alternative_routes[i]?.time.toFixed(1)} hrs</div>
               <div>Safety: ${(routeData.alternative_routes[i]?.safety_risk * 100).toFixed(1)}%</div>
             </div>`,
            { maxWidth: 200 }
          )
          .addTo(altGroup)
      })
    }

    // Show primary route initially
    allLayers.clearLayers()
    const primaryGroup2 = routeLayers.current.get(0)
    if (primaryGroup2) {
      primaryGroup2.eachLayer((layer) => allLayers.addLayer(layer))
    }

    // Fit bounds to primary route
    const primaryCoords2 = primaryRoute.map((wp) => [wp.latitude, wp.longitude] as [number, number])
    const bounds = L.latLngBounds(primaryCoords2)
    map.current.fitBounds(bounds, { padding: [50, 50] })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [routeData])

  const handleRouteSelect = (routeIndex: number) => {
    setSelectedRoute(routeIndex)

    if (!allLayersGroup || !map.current) return

    // Clear all layers
    allLayersGroup.clearLayers()

    // Add selected route
    const selectedGroup = routeLayers.current.get(routeIndex)
    if (selectedGroup) {
      selectedGroup.eachLayer((layer) => allLayersGroup.addLayer(layer))
    }

    // Add weather and piracy layers
    if (weatherLayer.current) {
      weatherLayer.current.eachLayer((layer) => allLayersGroup.addLayer(layer))
    }
    if (piracyLayer.current) {
      piracyLayer.current.eachLayer((layer) => allLayersGroup.addLayer(layer))
    }

    // Fit bounds to selected route
    const routeGroup = routeLayers.current.get(routeIndex)
    if (routeGroup) {
      const bounds = routeGroup.getBounds()
      if (bounds.isValid()) {
        map.current.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedRoute === 0 ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleRouteSelect(0)}
          className="gap-2"
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: routeColors[0] }} />
          Primary Route
        </Button>
        {[0, 1, 2, 3].map((idx) => (
          idx < routeData.alternative_routes.length && (
            <Button
              key={idx + 1}
              variant={selectedRoute === idx + 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRouteSelect(idx + 1)}
              className="gap-2"
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: routeColors[idx + 1] }} />
              Alt Route {idx + 1}
            </Button>
          )
        ))}
      </div>
      <div ref={mapContainer} className="w-full h-96 rounded-lg border border-border" />
    </div>
  )
}
