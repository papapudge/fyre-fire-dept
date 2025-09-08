"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Plus, 
  MapPin, 
  Phone, 
  AlertTriangle, 
  User, 
  Clock,
  Building,
  Car,
  Droplets,
  FileText,
  Camera
} from "lucide-react"

interface NewIncidentDialogProps {
  onIncidentCreated?: (incident: any) => void
}

export function NewIncidentDialog({ onIncidentCreated }: NewIncidentDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    severity: "",
    title: "",
    location: "",
    city: "",
    state: "",
    pincode: "",
    district: "",
    zone: "",
    callerName: "",
    callerPhone: "",
    description: "",
    estimatedLoss: "",
    injuries: "",
    fatalities: "",
    priority: "",
    specialInstructions: ""
  })

  const [selectedUnits, setSelectedUnits] = useState<string[]>([])
  const [selectedPersonnel, setSelectedPersonnel] = useState<string[]>([])

  const incidentTypes = [
    "Fire",
    "Medical Emergency", 
    "Rescue",
    "Hazmat",
    "Building Collapse",
    "Road Accident",
    "Industrial Accident",
    "Natural Disaster",
    "Bomb Threat",
    "Other"
  ]

  const severityLevels = [
    "Low",
    "Medium", 
    "High",
    "Critical"
  ]

  const availableUnits = [
    "Engine 1", "Engine 2", "Engine 3",
    "Ladder 1", "Ladder 2", "Ladder 3", 
    "Ambulance 1", "Ambulance 2", "Ambulance 3",
    "Rescue 1", "Rescue 2",
    "Command 1", "Command 2"
  ]

  const availablePersonnel = [
    "Rajesh Kumar", "Priya Sharma", "Amit Singh",
    "Sunita Patel", "Vikram Reddy", "Anjali Gupta",
    "Ravi Kumar", "Deepika Joshi", "Suresh Nair",
    "Kavita Singh", "Manoj Tiwari", "Pooja Agarwal"
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUnitToggle = (unit: string) => {
    setSelectedUnits(prev => 
      prev.includes(unit) 
        ? prev.filter(u => u !== unit)
        : [...prev, unit]
    )
  }

  const handlePersonnelToggle = (person: string) => {
    setSelectedPersonnel(prev => 
      prev.includes(person) 
        ? prev.filter(p => p !== person)
        : [...prev, person]
    )
  }

  const generateIncidentNumber = () => {
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
    return `${dateStr}-${timeStr}`
  }

  const handleSubmit = () => {
    if (!formData.type || !formData.severity || !formData.location) {
      alert("Please fill in all required fields (Type, Severity, Location)")
      return
    }

    const newIncident = {
      id: generateIncidentNumber(),
      incidentNumber: generateIncidentNumber(),
      type: formData.type,
      severity: formData.severity,
      status: "Dispatched",
      title: formData.title || `${formData.type} - ${formData.location}`,
      location: formData.location,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      district: formData.district,
      zone: formData.zone,
      lat: 0, // Would be geocoded in real app
      lng: 0, // Would be geocoded in real app
      reportedAt: new Date().toISOString(),
      dispatchedAt: new Date().toISOString(),
      arrivedAt: null,
      units: selectedUnits,
      personnel: selectedPersonnel,
      caller: formData.callerName,
      callerPhone: formData.callerPhone,
      description: formData.description,
      injuries: parseInt(formData.injuries) || 0,
      fatalities: parseInt(formData.fatalities) || 0,
      estimatedLoss: parseInt(formData.estimatedLoss) || 0,
      timestamp: new Date(),
      specialInstructions: formData.specialInstructions
    }

    console.log("New incident created:", newIncident)
    
    if (onIncidentCreated) {
      onIncidentCreated(newIncident)
    }

    // Reset form
    setFormData({
      type: "",
      severity: "",
      title: "",
      location: "",
      city: "",
      state: "",
      pincode: "",
      district: "",
      zone: "",
      callerName: "",
      callerPhone: "",
      description: "",
      estimatedLoss: "",
      injuries: "",
      fatalities: "",
      priority: "",
      specialInstructions: ""
    })
    setSelectedUnits([])
    setSelectedPersonnel([])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Incident
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Create New Incident</span>
          </DialogTitle>
          <DialogDescription>
            Report a new emergency incident and dispatch appropriate resources
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Incident Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Incident Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {incidentTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="severity">Severity *</Label>
                    <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        {severityLevels.map((severity) => (
                          <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Incident Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Brief description of the incident"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Detailed description of the incident..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Location Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="location">Address/Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Street address, landmark, or specific location"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      placeholder="Pincode"
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      placeholder="District"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="zone">Zone</Label>
                  <Input
                    id="zone"
                    value={formData.zone}
                    onChange={(e) => handleInputChange("zone", e.target.value)}
                    placeholder="Fire zone or area"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Caller Info & Resources */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Caller Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="callerName">Caller Name</Label>
                  <Input
                    id="callerName"
                    value={formData.callerName}
                    onChange={(e) => handleInputChange("callerName", e.target.value)}
                    placeholder="Name of person reporting"
                  />
                </div>

                <div>
                  <Label htmlFor="callerPhone">Caller Phone</Label>
                  <Input
                    id="callerPhone"
                    value={formData.callerPhone}
                    onChange={(e) => handleInputChange("callerPhone", e.target.value)}
                    placeholder="Phone number"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Car className="h-4 w-4" />
                  <span>Dispatch Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Available Units</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableUnits.map((unit) => (
                      <div
                        key={unit}
                        className={`p-2 border rounded cursor-pointer transition-colors ${
                          selectedUnits.includes(unit) 
                            ? "bg-blue-100 border-blue-500" 
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleUnitToggle(unit)}
                      >
                        <span className="text-sm">{unit}</span>
                      </div>
                    ))}
                  </div>
                  {selectedUnits.length > 0 && (
                    <div className="mt-2">
                      <Label>Selected Units:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedUnits.map((unit) => (
                          <Badge key={unit} variant="secondary">{unit}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Available Personnel</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2 max-h-32 overflow-y-auto">
                    {availablePersonnel.map((person) => (
                      <div
                        key={person}
                        className={`p-2 border rounded cursor-pointer transition-colors ${
                          selectedPersonnel.includes(person) 
                            ? "bg-green-100 border-green-500" 
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handlePersonnelToggle(person)}
                      >
                        <span className="text-sm">{person}</span>
                      </div>
                    ))}
                  </div>
                  {selectedPersonnel.length > 0 && (
                    <div className="mt-2">
                      <Label>Selected Personnel:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedPersonnel.map((person) => (
                          <Badge key={person} variant="outline">{person}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Additional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="injuries">Injuries</Label>
                    <Input
                      id="injuries"
                      type="number"
                      value={formData.injuries}
                      onChange={(e) => handleInputChange("injuries", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fatalities">Fatalities</Label>
                    <Input
                      id="fatalities"
                      type="number"
                      value={formData.fatalities}
                      onChange={(e) => handleInputChange("fatalities", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedLoss">Est. Loss (₹)</Label>
                    <Input
                      id="estimatedLoss"
                      type="number"
                      value={formData.estimatedLoss}
                      onChange={(e) => handleInputChange("estimatedLoss", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                    placeholder="Any special instructions for responding units..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Plus className="h-4 w-4 mr-2" />
            Create Incident
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
