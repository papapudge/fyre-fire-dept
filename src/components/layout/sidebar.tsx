"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Map,
  Users,
  AlertTriangle,
  BarChart3,
  Bell,
  Settings,
  Truck,
  Droplets,
  Building2,
  Menu,
  X,
} from "lucide-react"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Map & Assets", href: "/map", icon: Map },
  { name: "Personnel", href: "/personnel", icon: Users },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Admin", href: "/admin", icon: Settings },
]

const assetSubmenu = [
  { name: "Vehicles", href: "/assets/vehicles", icon: Truck },
  { name: "Hydrants", href: "/assets/hydrants", icon: Droplets },
  { name: "Stations", href: "/assets/stations", icon: Building2 },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [showAssets, setShowAssets] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-300 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Station */}
          <div className="px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 py-6">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <span className="text-xl font-bold text-gray-900">Fyre</span>
                <p className="text-xs text-gray-600">Station 1 - Central</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const isAssets = item.href === "/map"
              
              return (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-red-600 text-white shadow-md"
                        : "text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                    )}
                    onClick={() => {
                      if (isAssets) {
                        setShowAssets(!showAssets)
                      } else {
                        setIsOpen(false)
                      }
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                  
                  {/* Asset submenu */}
                  {isAssets && showAssets && (
                    <div className="ml-6 mt-2 space-y-1">
                      {assetSubmenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                            pathname === subItem.href
                              ? "bg-red-600 text-white shadow-sm"
                              : "text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          <subItem.icon className="mr-3 h-4 w-4" />
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    CC Operator
                  </p>
                </div>
              </div>
              <NotificationBell />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
