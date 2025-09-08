// Centralized mock data for Indian Fire Department operations

export interface Incident {
  id: string
  incidentNumber: string
  type: "Fire" | "Medical" | "Rescue" | "Hazmat" | "Building Collapse" | "Road Accident" | "Industrial Accident"
  severity: "Low" | "Medium" | "High" | "Critical"
  status: "Dispatched" | "En Route" | "On Scene" | "Closed"
  title: string
  location: string
  city: string
  state: string
  pincode: string
  lat: number
  lng: number
  reportedAt: string
  dispatchedAt: string
  arrivedAt: string | null
  units: string[]
  personnel: string[]
  caller: string
  callerPhone: string
  description: string
  injuries: number
  fatalities: number
  estimatedLoss: number
  timestamp: Date
  district: string
  zone: string
}

export interface Vehicle {
  id: string
  unitId: string
  type: "Engine" | "Ladder" | "Ambulance" | "Rescue" | "Command"
  name: string
  station: string
  status: "In Service" | "En Route" | "On Scene" | "Out of Service"
  location: string
  lat: number
  lng: number
  fuelLevel: number
  capabilities: string[]
  lastService: string
  nextService: string
  notes: string
  crew: string[]
  lastLocationUpdate: string
  speed?: number
  heading?: number
  isOnline: boolean
}

export interface Station {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  personnel: number
  vehicles: number
  capabilities: string[]
  contact: {
    phone: string
    email: string
  }
  status: "Active" | "Maintenance" | "Closed"
}

export interface Hydrant {
  id: string
  hydrantId: string
  lat: number
  lng: number
  status: "Active" | "Damaged" | "Out of Service"
  flowRate: number
  location: string
  lastInspection: string
  nextInspection: string
}

export interface Personnel {
  id: string
  name: string
  rank: string
  station: string
  status: "On Duty" | "On Scene" | "En Route" | "Off Duty"
  location: string
  certifications: string[]
  phone: string
  email: string
}

// Mock Data
export const mockIncidents: Incident[] = [
  {
    id: "1",
    incidentNumber: "20250509-001",
    type: "Fire",
    severity: "High",
    status: "On Scene",
    title: "Structure Fire - Residential",
    location: "123 Main St, Downtown",
    lat: 40.7128,
    lng: -74.0060,
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
    estimatedLoss: 150000,
    timestamp: new Date("2025-05-09T14:30:00Z")
  },
  {
    id: "2",
    incidentNumber: "20250509-002",
    type: "Medical",
    severity: "Medium",
    status: "En Route",
    title: "Medical Emergency - Cardiac",
    location: "456 Oak Ave, Midtown",
    lat: 40.7589,
    lng: -73.9851,
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
    estimatedLoss: 0,
    timestamp: new Date("2025-05-09T14:45:00Z")
  },
  {
    id: "3",
    incidentNumber: "20250509-003",
    type: "Rescue",
    severity: "Critical",
    status: "Dispatched",
    title: "Vehicle Accident - Entrapment",
    location: "789 Pine Rd, Highway 101",
    lat: 40.6892,
    lng: -74.0445,
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
    estimatedLoss: 50000,
    timestamp: new Date("2025-05-09T15:00:00Z")
  }
]

export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    unitId: "Engine 1",
    type: "Engine",
    name: "Engine 1",
    station: "Station 1",
    status: "On Scene",
    location: "123 Main St",
    lat: 40.7128,
    lng: -74.0060,
    fuelLevel: 85,
    capabilities: ["Fire Suppression", "Rescue", "Hazmat"],
    lastService: "2025-04-15",
    nextService: "2025-05-15",
    notes: "Primary response engine",
    crew: ["John Smith", "Mike Davis"],
    lastLocationUpdate: "2025-05-09T15:30:00Z",
    speed: 0,
    heading: 45,
    isOnline: true
  },
  {
    id: "2",
    unitId: "Ladder 2",
    type: "Ladder",
    name: "Ladder 2",
    station: "Station 1",
    status: "En Route",
    location: "456 Oak Ave",
    lat: 40.7589,
    lng: -73.9851,
    fuelLevel: 92,
    capabilities: ["Aerial Operations", "Rescue", "Ventilation"],
    lastService: "2025-04-20",
    nextService: "2025-05-20",
    notes: "100ft aerial ladder",
    crew: ["Sarah Johnson", "Tom Brown"],
    lastLocationUpdate: "2025-05-09T15:30:00Z",
    speed: 35,
    heading: 120,
    isOnline: true
  },
  {
    id: "3",
    unitId: "Ambulance 3",
    type: "Ambulance",
    name: "Ambulance 3",
    station: "Station 2",
    status: "In Service",
    location: "Station 2",
    lat: 40.6892,
    lng: -74.0445,
    fuelLevel: 78,
    capabilities: ["Medical Transport", "Basic Life Support", "Advanced Life Support"],
    lastService: "2025-04-10",
    nextService: "2025-05-10",
    notes: "ALS equipped ambulance",
    crew: ["Lisa Wilson"],
    lastLocationUpdate: "2025-05-09T15:45:00Z",
    speed: 0,
    heading: 0,
    isOnline: false
  }
]

export const mockStations: Station[] = [
  {
    id: "1",
    name: "Station 1",
    address: "123 Fire Station Rd, Downtown",
    lat: 40.7128,
    lng: -74.0060,
    personnel: 8,
    vehicles: 3,
    capabilities: ["Fire Suppression", "Rescue", "Hazmat"],
    contact: {
      phone: "(555) 111-1111",
      email: "station1@firedepartment.com"
    },
    status: "Active"
  },
  {
    id: "2",
    name: "Station 2",
    address: "456 Emergency Way, Midtown",
    lat: 40.7589,
    lng: -73.9851,
    personnel: 6,
    vehicles: 2,
    capabilities: ["Medical Response", "Fire Suppression"],
    contact: {
      phone: "(555) 222-2222",
      email: "station2@firedepartment.com"
    },
    status: "Active"
  },
  {
    id: "3",
    name: "Station 3",
    address: "789 Rescue Blvd, Uptown",
    lat: 40.6892,
    lng: -74.0445,
    personnel: 10,
    vehicles: 4,
    capabilities: ["Technical Rescue", "Hazmat", "Heavy Rescue"],
    contact: {
      phone: "(555) 333-3333",
      email: "station3@firedepartment.com"
    },
    status: "Active"
  }
]

export const mockHydrants: Hydrant[] = [
  {
    id: "1",
    hydrantId: "H-001",
    lat: 40.7200,
    lng: -74.0100,
    status: "Active",
    flowRate: 1000,
    location: "123 Main St",
    lastInspection: "2025-04-01",
    nextInspection: "2025-07-01"
  },
  {
    id: "2",
    hydrantId: "H-002",
    lat: 40.7300,
    lng: -73.9900,
    status: "Active",
    flowRate: 1200,
    location: "456 Oak Ave",
    lastInspection: "2025-04-15",
    nextInspection: "2025-07-15"
  },
  {
    id: "3",
    hydrantId: "H-003",
    lat: 40.7000,
    lng: -74.0200,
    status: "Damaged",
    flowRate: 0,
    location: "789 Pine Rd",
    lastInspection: "2025-03-20",
    nextInspection: "2025-06-20"
  }
]

export const mockPersonnel: Personnel[] = [
  {
    id: "1",
    name: "John Smith",
    rank: "Captain",
    station: "Station 1",
    status: "On Scene",
    location: "123 Main St",
    certifications: ["Firefighter I", "Firefighter II", "Hazmat Technician"],
    phone: "(555) 111-1111",
    email: "john.smith@firedepartment.com"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    rank: "Lieutenant",
    station: "Station 1",
    status: "En Route",
    location: "456 Oak Ave",
    certifications: ["Firefighter I", "Firefighter II", "EMT"],
    phone: "(555) 222-2222",
    email: "sarah.johnson@firedepartment.com"
  },
  {
    id: "3",
    name: "Mike Davis",
    rank: "Firefighter",
    station: "Station 1",
    status: "On Scene",
    location: "123 Main St",
    certifications: ["Firefighter I", "EMT"],
    phone: "(555) 333-3333",
    email: "mike.davis@firedepartment.com"
  },
  {
    id: "4",
    name: "Lisa Wilson",
    rank: "Paramedic",
    station: "Station 2",
    status: "On Duty",
    location: "Station 2",
    certifications: ["Paramedic", "EMT", "Firefighter I"],
    phone: "(555) 444-4444",
    email: "lisa.wilson@firedepartment.com"
  }
]

// Helper functions for consistent filtering
export const getActiveIncidents = () => mockIncidents.filter(incident => 
  incident.status !== "Closed"
)

export const getVehiclesByStatus = (status: string) => mockVehicles.filter(vehicle => 
  vehicle.status.toLowerCase().replace(" ", "_") === status.toLowerCase().replace(" ", "_")
)

export const getIncidentsByStatus = (status: string) => mockIncidents.filter(incident => 
  incident.status.toLowerCase().replace(" ", "_") === status.toLowerCase().replace(" ", "_")
)

export const getPersonnelByStatus = (status: string) => mockPersonnel.filter(person => 
  person.status.toLowerCase().replace(" ", "_") === status.toLowerCase().replace(" ", "_")
)
