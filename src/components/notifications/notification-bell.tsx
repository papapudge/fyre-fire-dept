"use client"

import { useState, useEffect } from "react"
import { Bell, Eye, EyeOff, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "incident" | "assignment" | "alert" | "info"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Incident Dispatch",
    message: "Structure fire reported at 123 Main St",
    time: "2 minutes ago",
    read: false,
    type: "incident"
  },
  {
    id: "2", 
    title: "Assignment Update",
    message: "Engine 1 assigned to incident 20250509-001",
    time: "5 minutes ago",
    read: false,
    type: "assignment"
  },
  {
    id: "3",
    title: "Vehicle Status",
    message: "Ladder 2 back in service",
    time: "15 minutes ago",
    read: true,
    type: "info"
  },
  {
    id: "4",
    title: "Maintenance Alert",
    message: "Engine 3 scheduled maintenance tomorrow",
    time: "1 hour ago",
    read: true,
    type: "alert"
  }
]

export function NotificationBell() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "incident": return "bg-red-100 text-red-800"
      case "assignment": return "bg-blue-100 text-blue-800" 
      case "alert": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewAll = () => {
    setOpen(false)
    router.push('/notifications')
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative p-2"
        onClick={() => setOpen(true)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Backdrop and Modal */}
      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="fixed top-20 right-6 w-96 bg-white rounded-lg border border-gray-600 z-50 max-h-[calc(100vh-6rem)] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs text-gray-600 hover:text-gray-900"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="p-1 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.slice(0, 8).map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "p-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors",
                    !notification.read && "bg-red-50 border-l-4 border-l-red-500"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full font-medium",
                          getTypeColor(notification.type)
                        )}>
                          {notification.type}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer */}
            {notifications.length > 8 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={handleViewAll}
                >
                  View All {notifications.length} Notifications
                </Button>
              </div>
            )}
            
            {notifications.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm font-medium mb-1">No notifications</p>
                <p className="text-xs text-gray-400">You're all caught up!</p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}