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
  FileText, 
  Clock, 
  User, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react"

interface IncidentLogDialogProps {
  incidentId: string
  incidentTitle?: string
  onLogCreated?: (log: any) => void
}

export function IncidentLogDialog({ incidentId, incidentTitle, onLogCreated }: IncidentLogDialogProps) {
  const [open, setOpen] = useState(false)
  const [logData, setLogData] = useState({
    type: "",
    status: "",
    description: "",
    location: "",
    personnel: "",
    equipment: "",
    casualties: "",
    actions: "",
    nextSteps: "",
    weather: "",
    visibility: "",
    specialNotes: ""
  })

  const logTypes = [
    "Status Update",
    "Arrival Report", 
    "Scene Assessment",
    "Resource Request",
    "Casualty Report",
    "Progress Update",
    "Completion Report",
    "Equipment Issue",
    "Weather Update",
    "Other"
  ]

  const statusOptions = [
    "En Route",
    "On Scene",
    "In Progress", 
    "Under Control",
    "Extinguished",
    "Cleared",
    "Standing By",
    "Returning to Station"
  ]

  const handleInputChange = (field: string, value: string) => {
    setLogData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    if (!logData.type || !logData.description) {
      alert("Please fill in Log Type and Description")
      return
    }

    const newLog = {
      id: `log-${Date.now()}`,
      incidentId: incidentId,
      timestamp: new Date().toISOString(),
      type: logData.type,
      status: logData.status,
      description: logData.description,
      location: logData.location,
      personnel: logData.personnel,
      equipment: logData.equipment,
      casualties: logData.casualties,
      actions: logData.actions,
      nextSteps: logData.nextSteps,
      weather: logData.weather,
      visibility: logData.visibility,
      specialNotes: logData.specialNotes,
      createdBy: "Current User", // In real app, get from auth
      priority: logData.type === "Casualty Report" ? "High" : "Normal"
    }

    console.log("New log entry created:", newLog)
    
    if (onLogCreated) {
      onLogCreated(newLog)
    }

    // Reset form
    setLogData({
      type: "",
      status: "",
      description: "",
      location: "",
      personnel: "",
      equipment: "",
      casualties: "",
      actions: "",
      nextSteps: "",
      weather: "",
      visibility: "",
      specialNotes: ""
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <FileText className="h-4 w-4 mr-1" />
          Log
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Incident Log Entry</span>
          </DialogTitle>
          <DialogDescription>
            {incidentTitle ? `Logging for: ${incidentTitle}` : `Incident ID: ${incidentId}`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Log Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Log Type *</Label>
                    <Select value={logData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {logTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Current Status</Label>
                    <Select value={logData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={logData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Detailed description of current situation..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="actions">Actions Taken</Label>
                  <Textarea
                    id="actions"
                    value={logData.actions}
                    onChange={(e) => handleInputChange("actions", e.target.value)}
                    placeholder="Actions taken since last update..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="nextSteps">Next Steps</Label>
                  <Textarea
                    id="nextSteps"
                    value={logData.nextSteps}
                    onChange={(e) => handleInputChange("nextSteps", e.target.value)}
                    placeholder="Planned next steps..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scene Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="location">Current Location</Label>
                  <Input
                    id="location"
                    value={logData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Specific location on scene"
                  />
                </div>

                <div>
                  <Label htmlFor="personnel">Personnel Present</Label>
                  <Input
                    id="personnel"
                    value={logData.personnel}
                    onChange={(e) => handleInputChange("personnel", e.target.value)}
                    placeholder="Names and roles of personnel"
                  />
                </div>

                <div>
                  <Label htmlFor="equipment">Equipment Used</Label>
                  <Input
                    id="equipment"
                    value={logData.equipment}
                    onChange={(e) => handleInputChange("equipment", e.target.value)}
                    placeholder="Equipment and tools used"
                  />
                </div>

                <div>
                  <Label htmlFor="casualties">Casualties</Label>
                  <Input
                    id="casualties"
                    value={logData.casualties}
                    onChange={(e) => handleInputChange("casualties", e.target.value)}
                    placeholder="Number and condition of casualties"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Environmental Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="weather">Weather Conditions</Label>
                  <Input
                    id="weather"
                    value={logData.weather}
                    onChange={(e) => handleInputChange("weather", e.target.value)}
                    placeholder="Current weather conditions"
                  />
                </div>

                <div>
                  <Label htmlFor="visibility">Visibility</Label>
                  <Input
                    id="visibility"
                    value={logData.visibility}
                    onChange={(e) => handleInputChange("visibility", e.target.value)}
                    placeholder="Visibility conditions"
                  />
                </div>

                <div>
                  <Label htmlFor="specialNotes">Special Notes</Label>
                  <Textarea
                    id="specialNotes"
                    value={logData.specialNotes}
                    onChange={(e) => handleInputChange("specialNotes", e.target.value)}
                    placeholder="Any special observations or concerns..."
                    rows={3}
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
            <FileText className="h-4 w-4 mr-2" />
            Create Log Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
