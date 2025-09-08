"use client"

import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Bell, 
  AlertTriangle, 
  Users, 
  Truck, 
  Settings,
  Check,
  X,
  Clock,
  MapPin,
  Phone
} from "lucide-react"
import { useState } from "react"

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "INCIDENT_DISPATCH",
    title: "New Incident Dispatch",
    message: "Structure fire reported at 123 Main St. Engine 1 and Ladder 2 dispatched.",
    timestamp: "2025-05-09T15:30:00Z",
    isRead: false,
    priority: "high",
    data: {
      incidentId: "20250509-001",
      location: "123 Main St",
      units: ["Engine 1", "Ladder 2"]
    }
  },
  {
    id: "2",
    type: "ASSIGNMENT",
    title: "Assignment Update",
    message: "You have been assigned to Engine 1 for incident 20250509-001.",
    timestamp: "2025-05-09T15:32:00Z",
    isRead: false,
    priority: "medium",
    data: {
      incidentId: "20250509-001",
      assignment: "Engine 1 - Firefighter"
    }
  },
  {
    id: "3",
    type: "MAINTENANCE_REMINDER",
    title: "Vehicle Maintenance Due",
    message: "Engine 3 is due for routine maintenance. Schedule service appointment.",
    timestamp: "2025-05-09T14:00:00Z",
    isRead: true,
    priority: "low",
    data: {
      vehicleId: "Engine 3",
      maintenanceType: "Routine"
    }
  },
  {
    id: "4",
    type: "SYSTEM_ALERT",
    title: "System Maintenance",
    message: "Scheduled system maintenance will occur tonight from 2-4 AM.",
    timestamp: "2025-05-09T10:00:00Z",
    isRead: true,
    priority: "medium",
    data: {
      maintenanceWindow: "2-4 AM"
    }
  },
  {
    id: "5",
    type: "INCIDENT_UPDATE",
    title: "Incident Status Update",
    message: "Incident 20250509-002 has been upgraded to HIGH priority.",
    timestamp: "2025-05-09T14:45:00Z",
    isRead: false,
    priority: "high",
    data: {
      incidentId: "20250509-002",
      newPriority: "HIGH"
    }
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "INCIDENT_DISPATCH": return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "ASSIGNMENT": return <Users className="h-5 w-5 text-blue-600" />
      case "MAINTENANCE_REMINDER": return <Truck className="h-5 w-5 text-orange-600" />
      case "SYSTEM_ALERT": return <Settings className="h-5 w-5 text-gray-600" />
      case "INCIDENT_UPDATE": return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default: return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive"
      case "medium": return "warning"
      case "low": return "success"
      default: return "secondary"
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.isRead
    return notification.type.toLowerCase() === filter
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Filter:</span>
          {["all", "unread", "incident_dispatch", "assignment", "maintenance_reminder", "system_alert"].map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterType)}
            >
              {filterType.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-colors ${
                  !notification.isRead ? "border-l-4 border-l-red-500 bg-red-50" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{notification.title}</h3>
                          <Badge variant={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(notification.timestamp)}</span>
                          </div>
                          {notification.data.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{notification.data.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Action buttons for specific notification types */}
                  {notification.type === "INCIDENT_DISPATCH" && (
                    <div className="mt-3 flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <MapPin className="h-4 w-4 mr-1" />
                        View Location
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Call Dispatch
                      </Button>
                    </div>
                  )}

                  {notification.type === "ASSIGNMENT" && (
                    <div className="mt-3 flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Users className="h-4 w-4 mr-1" />
                        View Assignment
                      </Button>
                      <Button size="sm" variant="outline">
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </div>
                  )}

                  {notification.type === "MAINTENANCE_REMINDER" && (
                    <div className="mt-3 flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Truck className="h-4 w-4 mr-1" />
                        Schedule Service
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No notifications found</p>
                  <p className="text-sm">You're all caught up!</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Notification Settings</span>
            </CardTitle>
            <CardDescription>
              Configure your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Incident Notifications</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">New incident dispatches</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Incident updates</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Incident closures</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Assignment Notifications</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">New assignments</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Assignment changes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Schedule updates</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">System Notifications</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Maintenance reminders</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">System alerts</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Training notifications</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">In-app notifications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">SMS alerts</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
