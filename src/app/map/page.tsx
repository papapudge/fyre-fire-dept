"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Construction } from "lucide-react"
import { Button } from "@/components/ui/button"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function MapPage() {
  const router = useRouter()

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Header with back button */}
      <div className="flex items-center justify-between p-3 bg-white border-b border border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <h1 className="text-base sm:text-lg font-semibold truncate">Fire Department Map</h1>
          </div>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 hidden sm:block flex-shrink-0">
          Real-time Emergency Response
        </div>
      </div>

      {/* Temporary placeholder */}
      <div className="flex-1 min-h-0 overflow-hidden flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Construction className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Map Under Construction</h2>
          <p className="text-gray-500 mb-4">The interactive map is being updated for better performance.</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
