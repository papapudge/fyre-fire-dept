"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface AddVehicleDialogProps {
  onVehicleAdded: (vehicle: any) => void
}

export function AddVehicleDialog({ onVehicleAdded }: AddVehicleDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    unitId: "",
    type: "",
    name: "",
    station: "",
    capabilities: [] as string[],
    notes: "",
    fuelLevel: 100
  })

  const [newCapability, setNewCapability] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create new vehicle object
    const newVehicle = {
      id: Date.now().toString(), // Simple ID generation
      ...formData,
      status: "In Service",
      location: formData.station,
      latitude: 40.7128 + (Math.random() - 0.5) * 0.01, // Random nearby coordinates
      longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
      lastService: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
      nextService: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      crew: [],
      lastLocationUpdate: new Date().toISOString()
    }

    // Call the callback to add the vehicle
    onVehicleAdded(newVehicle)
    
    // Reset form and close dialog
    setFormData({
      unitId: "",
      type: "",
      name: "",
      station: "",
      capabilities: [],
      notes: "",
      fuelLevel: 100
    })
    setOpen(false)
  }

  const addCapability = () => {
    if (newCapability.trim() && !formData.capabilities.includes(newCapability.trim())) {
      setFormData(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, newCapability.trim()]
      }))
      setNewCapability("")
    }
  }

  const removeCapability = (capability: string) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter(c => c !== capability)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Add a new vehicle to the fire department fleet
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitId">Unit ID *</Label>
              <Input
                id="unitId"
                value={formData.unitId}
                onChange={(e) => setFormData(prev => ({ ...prev, unitId: e.target.value }))}
                placeholder="Engine 1, Ladder 2, etc."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Vehicle Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Engine 1"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engine">Engine</SelectItem>
                  <SelectItem value="Ladder">Ladder Truck</SelectItem>
                  <SelectItem value="Ambulance">Ambulance</SelectItem>
                  <SelectItem value="Rescue">Rescue Vehicle</SelectItem>
                  <SelectItem value="Hazmat">Hazmat Unit</SelectItem>
                  <SelectItem value="Command">Command Vehicle</SelectItem>
                  <SelectItem value="Utility">Utility Vehicle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="station">Station *</Label>
              <Select value={formData.station} onValueChange={(value) => setFormData(prev => ({ ...prev, station: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Station 1">Station 1</SelectItem>
                  <SelectItem value="Station 2">Station 2</SelectItem>
                  <SelectItem value="Station 3">Station 3</SelectItem>
                  <SelectItem value="Headquarters">Headquarters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fuel Level */}
          <div className="space-y-2">
            <Label htmlFor="fuelLevel">Fuel Level (%)</Label>
            <Input
              id="fuelLevel"
              type="number"
              min="0"
              max="100"
              value={formData.fuelLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, fuelLevel: parseInt(e.target.value) || 0 }))}
              placeholder="85"
            />
          </div>

          {/* Capabilities */}
          <div className="space-y-2">
            <Label>Vehicle Capabilities</Label>
            <div className="flex space-x-2">
              <Input
                value={newCapability}
                onChange={(e) => setNewCapability(e.target.value)}
                placeholder="Add capability"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability())}
              />
              <Button type="button" onClick={addCapability}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.capabilities.map((capability, index) => (
                <div key={index} className="bg-blue-100 px-2 py-1 rounded text-sm flex items-center">
                  {capability}
                  <button
                    type="button"
                    onClick={() => removeCapability(capability)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this vehicle"
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Vehicle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}