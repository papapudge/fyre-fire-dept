"use client"

import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Clock,
  Users,
  Truck,
  Phone,
  FileText,
  Camera,
  Navigation
} from "lucide-react"
import { useState } from "react"
import { NewIncidentDialog } from "@/components/incidents/new-incident-dialog"
import { IncidentLogDialog } from "@/components/incidents/incident-log-dialog"

// Mock data
const mockIncidents = [
  {
    id: "20250509-001",
    type: "Fire",
    severity: "High",
    status: "On Scene",
    title: "Structure Fire - Residential",
    location: "123 Main St, Downtown",
    reportedAt: "2025-05-09T14:30:00Z",
    dispatchedAt: "2025-05-09T14:32:00Z",
    arrivedAt: "2025-05-09T14:38:00Z",
    units: ["Engine 1", "Ladder 2", "Ambulance 3"],
    personnel: ["John Smith", "Sarah Johnson", "Mike Davis"],
    caller: "John Doe",
    callerPhone: "(555) 123-4567",
    description: "Reported structure fire in residential building. Heavy smoke visible from second floor.",
    injuries: 0,
    fatalities: 0,
    estimatedLoss: 150000
  },
  {
    id: "20250509-002",
    type: "Medical",
    severity: "Medium",
    status: "En Route",
    title: "Medical Emergency - Cardiac",
    location: "456 Oak Ave, Midtown",
    reportedAt: "2025-05-09T14:45:00Z",
    dispatchedAt: "2025-05-09T14:46:00Z",
    arrivedAt: null,
    units: ["Ambulance 3"],
    personnel: ["Lisa Wilson"],
    caller: "Jane Smith",
    callerPhone: "(555) 987-6543",
    description: "65-year-old male experiencing chest pain and shortness of breath.",
    injuries: 1,
    fatalities: 0,
    estimatedLoss: 0
  },
  {
    id: "20250509-003",
    type: "Rescue",
    severity: "Critical",
    status: "Dispatched",
    title: "Vehicle Accident - Entrapment",
    location: "789 Pine Rd, Highway 101",
    reportedAt: "2025-05-09T15:00:00Z",
    dispatchedAt: "2025-05-09T15:01:00Z",
    arrivedAt: null,
    units: ["Rescue 1", "Engine 2", "Ambulance 1"],
    personnel: ["Tom Brown", "Amy Green", "Chris White"],
    caller: "Dispatch",
    callerPhone: "911",
    description: "Two-vehicle accident with reported entrapment. Jaws of life required.",
    injuries: 2,
    fatalities: 0,
    estimatedLoss: 50000
  }
]

export default function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [filter, setFilter] = useState("all")

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "destructive"
      case "high": return "destructive"
      case "medium": return "warning"
      case "low": return "success"
      default: return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on scene": return "success"
      case "en route": return "warning"
      case "dispatched": return "info"
      case "closed": return "secondary"
      default: return "secondary"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "fire": return "🔥"
      case "medical": return "🚑"
      case "rescue": return "🚨"
      case "hazmat": return "☢️"
      default: return "📞"
    }
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const filteredIncidents = mockIncidents.filter(incident => {
    if (filter === "all") return true
    // Convert status to match filter format
    const statusKey = incident.status.toLowerCase().replace(" ", "_")
    return statusKey === filter
  })

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Incidents</h1>
            <p className="text-gray-600">Emergency response management</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <NewIncidentDialog onIncidentCreated={(incident) => {
              console.log("New incident created:", incident)
              // In a real app, this would update the incidents list
            }} />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Status:</span>
          {["all", "dispatched", "en_route", "on_scene", "closed"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incidents List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredIncidents.map((incident) => (
              <Card 
                key={incident.id} 
                className={`cursor-pointer transition-colors ${
                  selectedIncident === incident.id ? "ring-2 ring-red-500" : ""
                }`}
                onClick={() => setSelectedIncident(incident.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTypeIcon(incident.type)}</span>
                      <div>
                        <CardTitle className="text-lg">{incident.id}</CardTitle>
                        <CardDescription>{incident.title}</CardDescription>
                      </div>
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
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{incident.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Reported: {formatTime(incident.reportedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{incident.personnel.length} personnel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span>{incident.units.length} units</span>
                    </div>
                  </div>
                  
                  {incident.injuries > 0 && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm">
                      <span className="font-medium text-red-800">
                        {incident.injuries} injury(ies) reported
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Incident Details */}
          <div className="space-y-4">
            {selectedIncident ? (
              (() => {
                const incident = mockIncidents.find(i => i.id === selectedIncident)
                if (!incident) return null
                
                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{getTypeIcon(incident.type)}</span>
                        <span>Incident Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Basic Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Basic Information</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">ID:</span> {incident.id}</p>
                          <p><span className="font-medium">Type:</span> {incident.type}</p>
                          <p><span className="font-medium">Severity:</span> 
                            <Badge variant={getSeverityColor(incident.severity)} className="ml-2">
                              {incident.severity}
                            </Badge>
                          </p>
                          <p><span className="font-medium">Status:</span>
                            <Badge variant={getStatusColor(incident.status)} className="ml-2">
                              {incident.status}
                            </Badge>
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Location</h4>
                        <div className="text-sm">
                          <p className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{incident.location}</span>
                          </p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Timeline</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Reported:</span> {formatTime(incident.reportedAt)}</p>
                          <p><span className="font-medium">Dispatched:</span> {formatTime(incident.dispatchedAt)}</p>
                          <p><span className="font-medium">Arrived:</span> {formatTime(incident.arrivedAt)}</p>
                        </div>
                      </div>

                      {/* Units & Personnel */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Units Assigned</h4>
                        <div className="space-y-1">
                          {incident.units.map((unit, index) => (
                            <Badge key={index} variant="outline" className="mr-1">
                              {unit}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Personnel</h4>
                        <div className="space-y-1">
                          {incident.personnel.map((person, index) => (
                            <Badge key={index} variant="secondary" className="mr-1">
                              {person}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Caller Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Caller Information</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Name:</span> {incident.caller}</p>
                          <p><span className="font-medium">Phone:</span> {incident.callerPhone}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Description</h4>
                        <p className="text-sm text-gray-600">{incident.description}</p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Navigate to map with incident location
                              const mapUrl = `/map?incident=${incident.id}&lat=${incident.lat || 40.7128}&lng=${incident.lng || -74.0060}`
                              window.open(mapUrl, '_blank')
                            }}
                          >
                            <Navigation className="h-4 w-4 mr-1" />
                            Navigate
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Call emergency number or incident contact
                              const phoneNumber = incident.callerPhone || "100" // Indian emergency number
                              window.open(`tel:${phoneNumber}`, '_self')
                            }}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Open incident log form
                              const logData = {
                                incidentId: incident.id,
                                timestamp: new Date().toISOString(),
                                action: "Log Entry",
                                details: `Log entry for incident ${incident.id}`
                              }
                              console.log("Creating log entry:", logData)
                              alert(`Log entry created for incident ${incident.id}`)
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Log
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Open camera or photo upload
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'image/*'
                              input.capture = 'environment' // Use back camera on mobile
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) {
                                  console.log("Photo captured for incident:", incident.id, file)
                                  alert(`Photo captured for incident ${incident.id}`)
                                }
                              }
                              input.click()
                            }}
                          >
                            <Camera className="h-4 w-4 mr-1" />
                            Photo
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })()
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-500">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select an incident to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
