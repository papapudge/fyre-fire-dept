"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Eye, 
  EyeOff, 
  Navigation, 
  Layers, 
  Activity,
  Truck,
  Building,
  Droplets,
  AlertTriangle,
  Users,
  ChevronLeft,
  ChevronRight,
  Settings,
  List,
  X,
  Locate
} from "lucide-react"
import dynamic from "next/dynamic"

// Dynamic import only for Google Maps to avoid SSR issues
const MapContent = dynamic(() => import('./google-map-content'), { 
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center">Loading Google Maps...</div>
})

// Import LiveTracking directly to avoid dynamic import conflicts
import { LiveTracking } from './live-tracking'

interface LayerState {
  stations: boolean
  vehicles: boolean
  hydrants: boolean
  incidents: boolean
  personnel: boolean
}

interface Vehicle {
  id: number
  unit: string
  lat: number
  lng: number
  status: string
  type: string
  lastUpdate: Date
  speed?: number
  heading?: number
  isOnline: boolean
}

// Mock data for all entities
const mockStations = [
  { id: 1, name: "Delhi Fire Station 1", lat: 28.6139, lng: 77.2090, personnel: 8, vehicles: 3 },
  { id: 2, name: "Delhi Fire Station 2", lat: 28.6149, lng: 77.2100, personnel: 6, vehicles: 2 },
  { id: 3, name: "Delhi Fire Station 3", lat: 28.6129, lng: 77.2080, personnel: 10, vehicles: 4 }
]

const mockVehicles: Vehicle[] = [
  { 
    id: 1, 
    unit: "Engine 1", 
    lat: 28.6139, 
    lng: 77.2090, 
    status: "On Scene", 
    type: "Engine",
    lastUpdate: new Date(),
    speed: 0,
    heading: 45,
    isOnline: true
  },
  { 
    id: 2, 
    unit: "Ladder 2", 
    lat: 28.6149, 
    lng: 77.2100, 
    status: "En Route", 
    type: "Ladder",
    lastUpdate: new Date(),
    speed: 35,
    heading: 120,
    isOnline: true
  },
  { 
    id: 3, 
    unit: "Ambulance 3", 
    lat: 28.6129, 
    lng: 77.2080, 
    status: "In Service", 
    type: "Ambulance",
    lastUpdate: new Date(),
    speed: 0,
    heading: 0,
    isOnline: false
  }
]

const mockHydrants = [
  { id: 1, hydrantId: "H-001", lat: 28.6140, lng: 77.2095, status: "Active", flowRate: 1000 },
  { id: 2, hydrantId: "H-002", lat: 28.6145, lng: 77.2105, status: "Active", flowRate: 1200 },
  { id: 3, hydrantId: "H-003", lat: 28.6135, lng: 77.2085, status: "Damaged", flowRate: 0 }
]

const mockIncidents = [
  { id: 1, incidentNumber: "20250509-001", lat: 28.6139, lng: 77.2090, type: "Fire", severity: "High" },
  { id: 2, incidentNumber: "20250509-002", lat: 28.6149, lng: 77.2100, type: "Medical", severity: "Medium" }
]

export function FireMap() {
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090]) // Delhi coordinates as tuple
  const [zoom, setZoom] = useState(12)
  const [layers, setLayers] = useState<LayerState>({
    stations: true,
    vehicles: true,
    hydrants: true,
    incidents: true,
    personnel: false
  })
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined)
  const [showLayersPanel, setShowLayersPanel] = useState(false)
  const [showEntitiesPanel, setShowEntitiesPanel] = useState(false)

  const toggleLayer = useCallback((layer: keyof LayerState) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }, [])

  const handleVehicleSelect = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowEntitiesPanel(true)
    // Center map on selected vehicle
    setCenter([vehicle.lat, vehicle.lng])
    setZoom(16)
  }, [])

  const handleLocate = useCallback(() => {
    // Reset to default center and zoom
    setCenter([28.6139, 77.2090])
    setZoom(12)
    setSelectedVehicle(undefined)
  }, [])

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Floating Control Panels */}
      
      {/* Layers Panel */}
      <div className={`absolute top-2 left-2 z-10 transition-all duration-300 ${
        showLayersPanel ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Card className="w-72 sm:w-80 shadow-lg max-h-[calc(100vh-4rem)] overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Map Layers
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLayersPanel(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={layers.stations ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("stations")}
              className="w-full justify-start"
            >
              {layers.stations ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              <Building className="h-4 w-4 mr-2" />
              Fire Stations
            </Button>
            <Button
              variant={layers.vehicles ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("vehicles")}
              className="w-full justify-start"
            >
              {layers.vehicles ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              <Truck className="h-4 w-4 mr-2" />
              Vehicles
            </Button>
            <Button
              variant={layers.hydrants ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("hydrants")}
              className="w-full justify-start"
            >
              {layers.hydrants ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              <Droplets className="h-4 w-4 mr-2" />
              Hydrants
            </Button>
            <Button
              variant={layers.incidents ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("incidents")}
              className="w-full justify-start"
            >
              {layers.incidents ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              <AlertTriangle className="h-4 w-4 mr-2" />
              Incidents
            </Button>
            <Button
              variant={layers.personnel ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("personnel")}
              className="w-full justify-start"
            >
              {layers.personnel ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              <Users className="h-4 w-4 mr-2" />
              Personnel
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Entities Panel */}
      <div className={`absolute top-2 right-2 z-10 transition-all duration-300 ${
        showEntitiesPanel ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <Card className="w-72 sm:w-80 shadow-lg max-h-[calc(100vh-4rem)] overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <List className="h-5 w-5" />
                Live Tracking
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEntitiesPanel(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-y-auto">
            <LiveTracking 
              vehicles={mockVehicles}
              onVehicleSelect={handleVehicleSelect}
              selectedVehicle={selectedVehicle}
            />
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLayersPanel(!showLayersPanel)}
          className="bg-white shadow-lg hover:bg-gray-50 text-xs sm:text-sm border border-gray-200"
        >
          <Layers className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Layers</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEntitiesPanel(!showEntitiesPanel)}
          className="bg-white shadow-lg hover:bg-gray-50 text-xs sm:text-sm border border-gray-200"
        >
          <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Entities</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLocate}
          className="bg-white shadow-lg hover:bg-gray-50 text-xs sm:text-sm border border-gray-200"
        >
          <Locate className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Locate</span>
        </Button>
      </div>

      {/* Map */}
      <div className="h-full">
        <MapContent
          center={center}
          zoom={zoom}
          layers={layers}
          mockStations={mockStations}
          mockVehicles={mockVehicles}
          mockHydrants={mockHydrants}
          mockIncidents={mockIncidents}
          getStatusColor={(status: string) => {
            switch (status.toLowerCase()) {
              case "on scene": return "destructive"
              case "en route": return "warning"
              case "in service": return "success"
              case "active": return "success"
              case "damaged": return "destructive"
              default: return "secondary"
            }
          }}
          getSeverityColor={(severity: string) => {
            switch (severity.toLowerCase()) {
              case "high": return "destructive"
              case "medium": return "warning"
              case "low": return "success"
              default: return "secondary"
            }
          }}
        />
      </div>
    </div>
  )
}