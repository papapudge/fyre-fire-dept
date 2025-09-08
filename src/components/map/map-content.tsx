"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon } from "leaflet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import "leaflet/dist/leaflet.css"

// Custom icons
const createCustomIcon = (color: string, icon: string) => {
  const svgString = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-family="Arial">${icon}</text>
    </svg>
  `.trim();
  
  return new Icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  })
}

const stationIcon = createCustomIcon("#3b82f6", "S")
const vehicleIcon = createCustomIcon("#10b981", "V")
const hydrantIcon = createCustomIcon("#06b6d4", "H")
const incidentIcon = createCustomIcon("#ef4444", "!")

interface LayerVisibility {
  stations: boolean
  vehicles: boolean
  hydrants: boolean
  incidents: boolean
}

interface MapContentProps {
  center: [number, number]
  zoom: number
  layers: LayerVisibility
  mockStations: any[]
  mockVehicles: any[]
  mockHydrants: any[]
  mockIncidents: any[]
  getStatusColor: (status: string) => string
  getSeverityColor: (severity: string) => string
}

export function MapContent({
  center,
  zoom,
  layers,
  mockStations,
  mockVehicles,
  mockHydrants,
  mockIncidents,
  getStatusColor,
  getSeverityColor
}: MapContentProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Stations */}
      {layers.stations && mockStations.map((station) => (
        <Marker
          key={station.id}
          position={[station.lat, station.lng]}
          icon={stationIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{station.name}</h3>
              <p className="text-sm text-gray-600">Personnel: {station.personnel}</p>
              <p className="text-sm text-gray-600">Vehicles: {station.vehicles}</p>
              <Button size="sm" className="mt-2 w-full">
                View Details
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Vehicles */}
      {layers.vehicles && mockVehicles.map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={[vehicle.lat, vehicle.lng]}
          icon={vehicleIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{vehicle.unit}</h3>
              <p className="text-sm text-gray-600">Type: {vehicle.type}</p>
              <Badge variant={getStatusColor(vehicle.status) as any} className="mt-1">
                {vehicle.status}
              </Badge>
              <Button size="sm" className="mt-2 w-full">
                Track Vehicle
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Hydrants */}
      {layers.hydrants && mockHydrants.map((hydrant) => (
        <Marker
          key={hydrant.id}
          position={[hydrant.lat, hydrant.lng]}
          icon={hydrantIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{hydrant.hydrantId}</h3>
              <p className="text-sm text-gray-600">Flow Rate: {hydrant.flowRate} GPM</p>
              <Badge variant={getStatusColor(hydrant.status) as any} className="mt-1">
                {hydrant.status}
              </Badge>
              <Button size="sm" className="mt-2 w-full">
                View Details
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Incidents */}
      {layers.incidents && mockIncidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.lat, incident.lng]}
          icon={incidentIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{incident.incidentNumber}</h3>
              <p className="text-sm text-gray-600">Type: {incident.type}</p>
              <Badge variant={getSeverityColor(incident.severity) as any} className="mt-1">
                {incident.severity}
              </Badge>
              <Button size="sm" className="mt-2 w-full">
                View Incident
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}