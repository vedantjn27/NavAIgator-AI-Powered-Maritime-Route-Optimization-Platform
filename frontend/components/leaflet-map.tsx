'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface LeafletMapProps {
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
  }
}

export default function LeafletMap({ routeData }: LeafletMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map
    map.current = L.map(mapContainer.current).setView([0, 20], 4)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current)

    const route = routeData.optimized_route

    // Add route polyline
    const routeCoords = route.map((wp) => [wp.latitude, wp.longitude] as [number, number])
    L.polyline(routeCoords, {
      color: '#3b82f6',
      weight: 3,
      opacity: 0.8,
      smoothFactor: 1,
    }).addTo(map.current)

    // Add waypoint markers
    route.forEach((wp, idx) => {
      let color: string
      let icon: string

      if (idx === 0) {
        color = 'green'
        icon = '▶'
      } else if (idx === route.length - 1) {
        color = 'red'
        icon = '🚩'
      } else {
        color = 'blue'
        icon = '⚓'
      }

      const marker = L.circleMarker([wp.latitude, wp.longitude], {
        radius: idx === 0 || idx === route.length - 1 ? 8 : 6,
        fillColor: color,
        color: 'white',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .bindPopup(
          `<div class="font-semibold">${wp.name}</div>
           <div class="text-xs text-gray-600 mt-2">
             <div>Weather: ${(wp.weather_risk * 100).toFixed(0)}%</div>
             <div>Piracy: ${(wp.piracy_risk * 100).toFixed(0)}%</div>
             <div>Traffic: ${(wp.maritime_traffic * 100).toFixed(0)}%</div>
           </div>`,
          { maxWidth: 200 }
        )
        .addTo(map.current!)

      marker.bindTooltip(wp.name, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
      })
    })

    // Add weather data visualization
    routeData.weather_data.forEach((weather) => {
      const intensity = Math.min(weather[2], 1)
      L.circleMarker([weather[0], weather[1]], {
        radius: 3 + intensity * 4,
        fillColor: '#fbbf24',
        color: 'transparent',
        fillOpacity: 0.3,
      }).addTo(map.current!)
    })

    // Add piracy hotspots
    routeData.piracy_data.forEach((piracy) => {
      L.circleMarker(piracy.location, {
        radius: 4 + piracy.intensity * 6,
        fillColor: '#ef4444',
        color: 'transparent',
        fillOpacity: 0.25,
      })
        .bindPopup(
          `<div class="font-semibold">Piracy Hotspot</div>
           <div class="text-xs">Risk: ${(piracy.intensity * 100).toFixed(0)}%</div>`
        )
        .addTo(map.current!)
    })

    // Fit bounds to route
    const bounds = L.latLngBounds(routeCoords)
    map.current.fitBounds(bounds, { padding: [50, 50] })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [routeData])

  return <div ref={mapContainer} className="w-full h-96 rounded-lg border border-border" />
}
