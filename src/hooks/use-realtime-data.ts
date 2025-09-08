"use client"

import { useState, useEffect, useCallback } from "react"

interface VehicleData {
  id: number
  unit: string
  lat: number
  lng: number
  status: string
  type: string
  lastUpdate: Date
  speed: number
  heading: number
  isOnline: boolean
}

interface IncidentData {
  id: number
  incidentNumber: string
  lat: number
  lng: number
  type: string
  severity: string
  timestamp: Date
}

export function useRealtimeData() {
  const [vehicles, setVehicles] = useState<VehicleData[]>([
    {
      id: 1,
      unit: "Engine 1",
      lat: 40.7128,
      lng: -74.0060,
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
      lat: 40.7589,
      lng: -73.9851,
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
      lat: 40.6892,
      lng: -74.0445,
      status: "In Service",
      type: "Ambulance",
      lastUpdate: new Date(),
      speed: 0,
      heading: 0,
      isOnline: false
    }
  ])

  const [incidents, setIncidents] = useState<IncidentData[]>([
    {
      id: 1,
      incidentNumber: "20250509-001",
      lat: 40.7128,
      lng: -74.0060,
      type: "Fire",
      severity: "High",
      timestamp: new Date()
    },
    {
      id: 2,
      incidentNumber: "20250509-002",
      lat: 40.7589,
      lng: -73.9851,
      type: "Medical",
      severity: "Medium",
      timestamp: new Date()
    }
  ])

  const [isTracking, setIsTracking] = useState(false)

  // Simulate vehicle movement
  const updateVehiclePositions = useCallback(() => {
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => {
        if (!vehicle.isOnline || vehicle.status === "On Scene") {
          return vehicle
        }

        // Simulate movement for vehicles that are moving
        const speedInDegrees = vehicle.speed / 111000 // Rough conversion from mph to degrees
        const newLat = vehicle.lat + (Math.random() - 0.5) * speedInDegrees * 0.1
        const newLng = vehicle.lng + (Math.random() - 0.5) * speedInDegrees * 0.1
        
        return {
          ...vehicle,
          lat: Math.max(40.5, Math.min(41.0, newLat)), // Keep within bounds
          lng: Math.max(-74.2, Math.min(-73.8, newLng)),
          lastUpdate: new Date(),
          heading: (vehicle.heading + (Math.random() - 0.5) * 10) % 360
        }
      })
    )
  }, [])

  // Simulate new incidents
  const generateNewIncident = useCallback(() => {
    const incidentTypes = ["Fire", "Medical", "Rescue", "Hazmat"]
    const severities = ["Low", "Medium", "High"]
    
    const newIncident: IncidentData = {
      id: Date.now(),
      incidentNumber: `20250509-${String(incidents.length + 1).padStart(3, '0')}`,
      lat: 40.7 + (Math.random() - 0.5) * 0.1,
      lng: -74.0 + (Math.random() - 0.5) * 0.1,
      type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      timestamp: new Date()
    }

    setIncidents(prev => [...prev, newIncident])
  }, [incidents.length])

  // Start/stop tracking
  const toggleTracking = useCallback(() => {
    setIsTracking(prev => !prev)
  }, [])

  // Update vehicle status
  const updateVehicleStatus = useCallback((vehicleId: number, status: string) => {
    setVehicles(prev => 
      prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, status, lastUpdate: new Date() }
          : vehicle
      )
    )
  }, [])

  // Real-time updates
  useEffect(() => {
    if (!isTracking) return

    const vehicleInterval = setInterval(updateVehiclePositions, 5000) // Update every 5 seconds
    const incidentInterval = setInterval(generateNewIncident, 30000) // New incident every 30 seconds

    return () => {
      clearInterval(vehicleInterval)
      clearInterval(incidentInterval)
    }
  }, [isTracking, updateVehiclePositions, generateNewIncident])

  return {
    vehicles,
    incidents,
    isTracking,
    toggleTracking,
    updateVehicleStatus
  }
}
