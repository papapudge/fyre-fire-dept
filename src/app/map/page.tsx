"use client"

import { Suspense } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import FireMap directly to avoid dynamic import conflicts
import { FireMap } from "@/components/map/fire-map"

export default function MapPage() {
  const router = useRouter()

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Header with back button */}
      <div className="flex items-center justify-between p-3 bg-white border-b shadow-sm flex-shrink-0">
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

      {/* Map content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Suspense fallback={
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        }>
          <FireMap />
        </Suspense>
      </div>
    </div>
  )
}
