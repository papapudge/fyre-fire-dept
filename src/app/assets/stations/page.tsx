"use client"

import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Users,
  Truck,
  Phone,
  Shield,
  Clock
} from "lucide-react"
import { useState } from "react"

// Mock station data
const mockStations = [
  {
    id: "1",
    stationId: "Station 1",
    name: "Central Fire Station",
    address: "100 Fire Station Way",
    latitude: 40.7128,
    longitude: -74.0060,
    status: "Active",
    personnelCount: 12,
    vehicleCount: 4,
    captain: "John Smith",
    phone: "(555) 100-0001",
    established: "1985-06-15",
    coverage: "Downtown District",
    vehicles: ["Engine 1", "Ladder 1", "Ambulance 1", "Rescue 1"],
    specialties: ["High-rise", "Hazmat", "Water Rescue"],
    notes: "Primary response station for downtown area"
  },
  {
    id: "2", 
    stationId: "Station 2",
    name: "Eastside Fire Station",
    address: "250 East Avenue",
    latitude: 40.7200,
    longitude: -74.0100,
    status: "Active",
    personnelCount: 10,
    vehicleCount: 3,
    captain: "Sarah Johnson", 
    phone: "(555) 100-0002",
    established: "1992-03-10",
    coverage: "East District",
    vehicles: ["Engine 2", "Ladder 2", "Ambulance 2"],
    specialties: ["Medical Emergency", "Vehicle Rescue"],
    notes: "Covers eastern residential and commercial areas"
  },
  {
    id: "3",
    stationId: "Station 3", 
    name: "Industrial Fire Station",
    address: "500 Industrial Blvd",
    latitude: 40.6950,
    longitude: -74.0200,
    status: "Active",
    personnelCount: 8,
    vehicleCount: 3,
    captain: "Mike Davis",
    phone: "(555) 100-0003", 
    established: "1998-11-22",
    coverage: "Industrial District",
    vehicles: ["Engine 3", "Hazmat 1", "Foam Unit 1"],
    specialties: ["Hazmat", "Industrial Fires", "Chemical Response"],
    notes: "Specialized for industrial and chemical emergencies"
  },
  {
    id: "4",
    stationId: "Station 4",
    name: "Westside Fire Station", 
    address: "800 West Road",
    latitude: 40.7300,
    longitude: -73.9900,
    status: "Maintenance",
    personnelCount: 6,
    vehicleCount: 2,
    captain: "Lisa Wilson",
    phone: "(555) 100-0004",
    established: "2005-08-30",
    coverage: "West District", 
    vehicles: ["Engine 4", "Ambulance 3"],
    specialties: ["Wildfire", "Rural Response"],
    notes: "Currently undergoing facility upgrades"
  }
]

export default function StationsPage() {
  const [stations, setStations] = useState(mockStations)
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "success"
      case "maintenance": return "warning"  
      case "inactive": return "destructive"
      default: return "secondary"
    }
  }

  const filteredStations = stations.filter(station => {
    const matchesFilter = filter === "all" || station.status.toLowerCase() === filter
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.stationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.address.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fire Stations</h1>
            <p className="text-gray-700">Fire station management and overview</p>
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Station
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search stations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-800">Status:</span>
            {["all", "active", "maintenance", "inactive"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stations List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredStations.map((station) => (
              <Card 
                key={station.id} 
                className={`cursor-pointer transition-all hover:border-gray-300 ${
                  selectedStation === station.id ? "ring-2 ring-red-500 border-gray-300" : ""
                }`}
                onClick={() => setSelectedStation(station.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900">{station.name}</CardTitle>
                        <CardDescription className="text-gray-700">{station.stationId} • {station.address}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(station.status)}>
                      {station.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-800">{station.personnelCount} Personnel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-800">{station.vehicleCount} Vehicles</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-800">Capt. {station.captain}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-800">{station.coverage}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {station.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Station Details */}
          <div className="space-y-4">
            {selectedStation ? (
              (() => {
                const station = stations.find(s => s.id === selectedStation)
                if (!station) return null
                
                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5" />
                        <span>Station Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Basic Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Basic Information</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium text-gray-800">Station:</span> <span className="text-gray-900">{station.stationId}</span></p>
                          <p><span className="font-medium text-gray-800">Name:</span> <span className="text-gray-900">{station.name}</span></p>
                          <p><span className="font-medium text-gray-800">Address:</span> <span className="text-gray-900">{station.address}</span></p>
                          <p><span className="font-medium text-gray-800">Status:</span>
                            <Badge variant={getStatusColor(station.status)} className="ml-2">
                              {station.status}
                            </Badge>
                          </p>
                          <p><span className="font-medium text-gray-800">Established:</span> <span className="text-gray-900">{new Date(station.established).toLocaleDateString()}</span></p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Contact Information</h4>
                        <div className="text-sm space-y-1">
                          <p className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span className="text-gray-900">{station.phone}</span>
                          </p>
                          <p><span className="font-medium text-gray-800">Captain:</span> <span className="text-gray-900">{station.captain}</span></p>
                        </div>
                      </div>

                      {/* Resources */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Resources</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium text-gray-800">Personnel:</span> <span className="text-gray-900">{station.personnelCount}</span></p>
                          <p><span className="font-medium text-gray-800">Coverage Area:</span> <span className="text-gray-900">{station.coverage}</span></p>
                        </div>
                      </div>

                      {/* Vehicles */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Vehicles</h4>
                        <div className="space-y-1">
                          {station.vehicles.map((vehicle, index) => (
                            <Badge key={index} variant="secondary" className="mr-1 mb-1">
                              {vehicle}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Specialties</h4>
                        <div className="space-y-1">
                          {station.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="mr-1 mb-1">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Notes</h4>
                        <p className="text-sm text-gray-700">{station.notes}</p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <MapPin className="h-4 w-4 mr-1" />
                            Locate
                          </Button>
                          <Button size="sm" variant="outline">
                            <Clock className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
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
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Select a station to view details</p>
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