"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Building2, 
  Users, 
  Truck, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Phone,
  Mail,
  Calendar,
  BarChart3
} from "lucide-react"

interface StationDetailsDialogProps {
  station: {
    station: string
    incidents: number
    avgResponseTime: number
    personnel: number
    vehicles: number
  }
  isOpen: boolean
  onClose: () => void
}

export function StationDetailsDialog({ station, isOpen, onClose }: StationDetailsDialogProps) {
  // Mock detailed data for the station
  const stationDetails = {
    ...station,
    address: "123 Fire Station Road, Delhi 110001",
    phone: "+91 11 2345 6789",
    email: `${station.station.toLowerCase().replace(' ', '')}@firedepartment.com`,
    established: "2015",
    coverage: "5.2 sq km",
    population: "45,000",
    recentIncidents: [
      { id: "20250509-001", type: "Fire", severity: "High", time: "14:30", status: "Resolved" },
      { id: "20250509-002", type: "Medical", severity: "Medium", time: "12:15", status: "Resolved" },
      { id: "20250509-003", type: "Rescue", severity: "Low", time: "10:45", status: "Active" }
    ],
    personnel: [
      { name: "John Smith", role: "Captain", status: "On Duty", shift: "Day" },
      { name: "Sarah Johnson", role: "Lieutenant", status: "On Scene", shift: "Day" },
      { name: "Mike Davis", role: "Firefighter", status: "On Duty", shift: "Day" },
      { name: "Lisa Wilson", role: "Firefighter", status: "On Duty", shift: "Day" },
      { name: "Rajesh Kumar", role: "Firefighter", status: "Off Duty", shift: "Night" },
      { name: "Priya Sharma", role: "Firefighter", status: "Off Duty", shift: "Night" }
    ],
    vehicles: [
      { unit: "Engine 1", type: "Fire Engine", status: "On Scene", lastMaintenance: "2025-01-05" },
      { unit: "Ladder 2", type: "Ladder Truck", status: "In Service", lastMaintenance: "2025-01-03" },
      { unit: "Ambulance 3", type: "Ambulance", status: "In Service", lastMaintenance: "2025-01-07" }
    ],
    performance: {
      thisMonth: {
        incidents: station.incidents,
        avgResponseTime: station.avgResponseTime,
        successRate: 94.2,
        trainingHours: 48
      },
      lastMonth: {
        incidents: station.incidents - 3,
        avgResponseTime: station.avgResponseTime + 0.2,
        successRate: 91.8,
        trainingHours: 52
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on duty":
      case "in service":
      case "resolved":
        return "success"
      case "on scene":
      case "active":
        return "warning"
      case "off duty":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "warning"
      case "low":
        return "success"
      default:
        return "secondary"
    }
  }

  const calculateTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change).toFixed(1),
      direction: change > 0 ? "up" : "down",
      isPositive: change < 0 // For response time, lower is better
    }
  }

  const responseTimeTrend = calculateTrend(
    stationDetails.performance.thisMonth.avgResponseTime,
    stationDetails.performance.lastMonth.avgResponseTime
  )

  const incidentsTrend = calculateTrend(
    stationDetails.performance.thisMonth.incidents,
    stationDetails.performance.lastMonth.incidents
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span>{stationDetails.station} - Detailed Report</span>
          </DialogTitle>
          <DialogDescription>
            Comprehensive performance metrics and operational details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Station Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Station Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{stationDetails.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{stationDetails.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{stationDetails.email}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Established: {stationDetails.established}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Coverage: {stationDetails.coverage}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Population: {stationDetails.population}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Incidents This Month</p>
                    <p className="text-2xl font-bold">{stationDetails.performance.thisMonth.incidents}</p>
                  </div>
                  <div className="text-right">
                    {incidentsTrend.direction === "up" ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    )}
                    <p className="text-xs text-gray-500">
                      {incidentsTrend.direction === "up" ? "+" : "-"}{incidentsTrend.value}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Avg Response Time</p>
                    <p className="text-2xl font-bold">{stationDetails.performance.thisMonth.avgResponseTime}m</p>
                  </div>
                  <div className="text-right">
                    {responseTimeTrend.direction === "up" ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    )}
                    <p className="text-xs text-gray-500">
                      {responseTimeTrend.direction === "up" ? "+" : "-"}{responseTimeTrend.value}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Success Rate</p>
                    <p className="text-2xl font-bold">{stationDetails.performance.thisMonth.successRate}%</p>
                  </div>
                  <div className="text-right">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-500">+2.4%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Training Hours</p>
                    <p className="text-2xl font-bold">{stationDetails.performance.thisMonth.trainingHours}</p>
                  </div>
                  <div className="text-right">
                    <TrendingDown className="h-4 w-4 text-orange-500" />
                    <p className="text-xs text-gray-500">-4h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Incidents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Recent Incidents</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stationDetails.recentIncidents.map((incident, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{incident.id}</p>
                      <p className="text-sm text-gray-600">{incident.type} • {incident.time}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge variant={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Personnel Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Personnel Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stationDetails.personnel.map((person, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-gray-600">{person.role} • {person.shift} Shift</p>
                    </div>
                    <Badge variant={getStatusColor(person.status)}>
                      {person.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Vehicle Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stationDetails.vehicles.map((vehicle, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{vehicle.unit}</p>
                      <Badge variant={getStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{vehicle.type}</p>
                    <p className="text-xs text-gray-500">
                      Last Maintenance: {vehicle.lastMaintenance}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => alert('Exporting station report...')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
