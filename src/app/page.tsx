"use client"

import { useRouter } from "next/navigation"
import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  Users, 
  Truck, 
  MapPin, 
  Clock, 
  TrendingUp,
  Activity,
  Shield,
  Phone,
  Navigation,
  Camera,
  FileText
} from "lucide-react"

// Mock data - in real app this would come from API
const mockData = {
  activeIncidents: 3,
  personnelOnDuty: 24,
  vehiclesInService: 8,
  averageResponseTime: "4.2",
  recentIncidents: [
    {
      id: "20250509-001",
      type: "Fire",
      severity: "High",
      location: "123 Main St",
      status: "On Scene",
      time: "14:30",
      units: ["Engine 1", "Ladder 2"]
    },
    {
      id: "20250509-002", 
      type: "Medical",
      severity: "Medium",
      location: "456 Oak Ave",
      status: "En Route",
      time: "14:45",
      units: ["Ambulance 3"]
    },
    {
      id: "20250509-003",
      type: "Rescue",
      severity: "Critical", 
      location: "789 Pine Rd",
      status: "Dispatched",
      time: "15:00",
      units: ["Rescue 1", "Engine 2"]
    }
  ],
  personnelStatus: [
    { name: "John Smith", status: "On Scene", location: "123 Main St" },
    { name: "Sarah Johnson", status: "En Route", location: "456 Oak Ave" },
    { name: "Mike Davis", status: "On Duty", location: "Station 1" },
    { name: "Lisa Wilson", status: "On Duty", location: "Station 2" }
  ],
  vehicleStatus: [
    { unit: "Engine 1", status: "On Scene", location: "123 Main St" },
    { unit: "Ladder 2", status: "On Scene", location: "123 Main St" },
    { unit: "Ambulance 3", status: "En Route", location: "456 Oak Ave" },
    { unit: "Rescue 1", status: "Dispatched", location: "789 Pine Rd" },
    { unit: "Engine 2", status: "Dispatched", location: "789 Pine Rd" },
    { unit: "Engine 3", status: "In Service", location: "Station 1" },
    { unit: "Ladder 1", status: "In Service", location: "Station 2" },
    { unit: "Ambulance 1", status: "In Service", location: "Station 1" }
  ]
}

export default function Dashboard() {
  const router = useRouter()

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
      case "in service": return "success"
      case "on duty": return "success"
      default: return "secondary"
    }
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Fire Department Operations Center</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="success" className="flex items-center space-x-1">
              <Activity className="h-3 w-3" />
              <span>All Systems Operational</span>
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className="cursor-pointer hover:border-gray-300 transition-colors border"
            onClick={() => router.push('/incidents')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{mockData.activeIncidents}</div>
              <p className="text-xs text-muted-foreground">
                +1 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-gray-300 transition-colors border"
            onClick={() => router.push('/personnel')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Personnel On Duty</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{mockData.personnelOnDuty}</div>
              <p className="text-xs text-muted-foreground">
                12 available for dispatch
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-gray-300 transition-colors border"
            onClick={() => router.push('/map')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicles In Service</CardTitle>
              <Truck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{mockData.vehiclesInService}</div>
              <p className="text-xs text-muted-foreground">
                2 out of service for maintenance
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-gray-300 transition-colors border"
            onClick={() => router.push('/reports')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{mockData.averageResponseTime}m</div>
              <p className="text-xs text-muted-foreground">
                -0.3m from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Incidents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Active Incidents</span>
              </CardTitle>
              <CardDescription>
                Current emergency responses in progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.recentIncidents.map((incident) => (
                <div 
                  key={incident.id} 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => router.push(`/incidents?selected=${incident.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{incident.id}</span>
                      <Badge variant={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{incident.type} - {incident.location}</p>
                    <p className="text-xs text-gray-500">{incident.units.join(", ")}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{incident.time}</p>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/incidents')}
              >
                View All Incidents
              </Button>
            </CardContent>
          </Card>

          {/* Personnel Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Personnel Status</span>
              </CardTitle>
              <CardDescription>
                Current status of field personnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.personnelStatus.map((person, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => router.push(`/personnel?selected=${person.name}`)}
                >
                  <div className="flex-1">
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-gray-600">{person.location}</p>
                  </div>
                  <Badge variant={getStatusColor(person.status)}>
                    {person.status}
                  </Badge>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/personnel')}
              >
                View All Personnel
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-green-600" />
              <span>Vehicle Status</span>
            </CardTitle>
            <CardDescription>
              Real-time status of all apparatus and vehicles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockData.vehicleStatus.map((vehicle, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => router.push(`/assets/vehicles?selected=${vehicle.unit}`)}
                >
                  <div className="flex-1">
                    <p className="font-medium">{vehicle.unit}</p>
                    <p className="text-sm text-gray-600">{vehicle.location}</p>
                  </div>
                  <Badge variant={getStatusColor(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Actions</CardTitle>
            <CardDescription>
              Quick access to emergency response tools and communications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Navigate Action */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  {/* iPhone-style background */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl border border-blue-500 flex items-center justify-center transform hover:scale-105 transition-transform cursor-pointer"
                       onClick={() => router.push('/map')}>
                    <Navigation className="h-8 w-8 text-white" />
                  </div>
                  {/* Notification badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">3</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-800">Navigate</span>
                <p className="text-xs text-gray-500 text-center">GPS to incident locations</p>
              </div>

              {/* Call Action */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl border border-green-500 flex items-center justify-center transform hover:scale-105 transition-transform cursor-pointer"
                       onClick={() => window.open('tel:100', '_self')}>
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-800">Call</span>
                <p className="text-xs text-gray-500 text-center">Emergency (100)</p>
              </div>

              {/* Log Action */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl border border-orange-500 flex items-center justify-center transform hover:scale-105 transition-transform cursor-pointer"
                       onClick={() => router.push('/reports')}>
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  {/* New reports indicator */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-gray-800">Log</span>
                <p className="text-xs text-gray-500 text-center">Incident reports & logs</p>
              </div>

              {/* Photo Action */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl border border-purple-500 flex items-center justify-center transform hover:scale-105 transition-transform cursor-pointer"
                       onClick={() => {
                         // In a real app, this would open camera or photo gallery
                         alert('Photo capture feature would open camera on mobile device')
                       }}>
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-800">Photo</span>
                <p className="text-xs text-gray-500 text-center">Document incidents</p>
              </div>
            </div>

            {/* Additional Quick Actions Row */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="h-12 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700"
                  onClick={() => router.push('/incidents')}
                >
                  <AlertTriangle className="h-5 w-5" />
                  <span>New Incident</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 flex items-center justify-center space-x-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => router.push('/map')}
                >
                  <MapPin className="h-5 w-5" />
                  <span>Live Map</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 flex items-center justify-center space-x-2 border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => router.push('/personnel')}
                >
                  <Users className="h-5 w-5" />
                  <span>Personnel Status</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
    </Layout>
  )
}