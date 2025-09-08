import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date))
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function generateIncidentNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
  return `${year}${month}${day}-${random}`
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
    case "in_service":
    case "on_duty":
      return "text-green-600 bg-green-100"
    case "dispatched":
    case "en_route":
      return "text-yellow-600 bg-yellow-100"
    case "on_scene":
      return "text-blue-600 bg-blue-100"
    case "closed":
    case "completed":
      return "text-gray-600 bg-gray-100"
    case "out_of_service":
    case "off_duty":
      return "text-red-600 bg-red-100"
    case "maintenance":
      return "text-orange-600 bg-orange-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case "low":
      return "text-green-600 bg-green-100"
    case "medium":
      return "text-yellow-600 bg-yellow-100"
    case "high":
      return "text-orange-600 bg-orange-100"
    case "critical":
      return "text-red-600 bg-red-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}
