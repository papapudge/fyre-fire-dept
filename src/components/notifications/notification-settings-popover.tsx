"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Check,
  X
} from "lucide-react"

interface NotificationSettingsPopoverProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationSettingsPopover({ isOpen, onClose }: NotificationSettingsPopoverProps) {
  const [settings, setSettings] = useState({
    incidentNotifications: {
      newDispatches: true,
      updates: true,
      closures: false
    },
    assignmentNotifications: {
      newAssignments: true,
      changes: true,
      scheduleUpdates: false
    },
    systemNotifications: {
      maintenanceReminders: true,
      systemAlerts: true,
      trainingNotifications: false
    },
    deliveryMethods: {
      inApp: true,
      email: false,
      sms: false
    }
  })

  const updateSetting = (category: string, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }))
  }

  const saveSettings = () => {
    // In a real app, this would save to backend
    console.log("Saving notification settings:", settings)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 max-h-[80vh] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Notification Settings</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Settings Content */}
        <div className="p-4 space-y-6">
          {/* Incident Notifications */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <Bell className="h-4 w-4 text-red-600" />
              <span>Incident Notifications</span>
            </h4>
            <div className="space-y-2 pl-6">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">New incident dispatches</span>
                <input 
                  type="checkbox" 
                  checked={settings.incidentNotifications.newDispatches}
                  onChange={(e) => updateSetting('incidentNotifications', 'newDispatches', e.target.checked)}
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Incident updates</span>
                <input 
                  type="checkbox" 
                  checked={settings.incidentNotifications.updates}
                  onChange={(e) => updateSetting('incidentNotifications', 'updates', e.target.checked)}
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Incident closures</span>
                <input 
                  type="checkbox" 
                  checked={settings.incidentNotifications.closures}
                  onChange={(e) => updateSetting('incidentNotifications', 'closures', e.target.checked)}
                  className="rounded"
                />
              </label>
            </div>
          </div>

          {/* Assignment Notifications */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span>Assignment Notifications</span>
            </h4>
            <div className="space-y-2 pl-6">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">New assignments</span>
                <input 
                  type="checkbox" 
                  checked={settings.assignmentNotifications.newAssignments}
                  onChange={(e) => updateSetting('assignmentNotifications', 'newAssignments', e.target.checked)}
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Assignment changes</span>
                <input 
                  type="checkbox" 
                  checked={settings.assignmentNotifications.changes}
                  onChange={(e) => updateSetting('assignmentNotifications', 'changes', e.target.checked)}
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Schedule updates</span>
                <input 
                  type="checkbox" 
                  checked={settings.assignmentNotifications.scheduleUpdates}
                  onChange={(e) => updateSetting('assignmentNotifications', 'scheduleUpdates', e.target.checked)}
                  className="rounded"
                />
              </label>
            </div>
          </div>

          {/* System Notifications */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <Settings className="h-4 w-4 text-orange-600" />
              <span>System Notifications</span>
            </h4>
            <div className="space-y-2 pl-6">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Maintenance reminders</span>
                <input 
                  type="checkbox" 
                  checked={settings.systemNotifications.maintenanceReminders}
                  onChange={(e) => updateSetting('systemNotifications', 'maintenanceReminders', e.target.checked)}
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">System alerts</span>
                <input 
                  type="checkbox" 
                  checked={settings.systemNotifications.systemAlerts}
                  onChange={(e) => updateSetting('systemNotifications', 'systemAlerts', e.target.checked)}
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Training notifications</span>
                <input 
                  type="checkbox" 
                  checked={settings.systemNotifications.trainingNotifications}
                  onChange={(e) => updateSetting('systemNotifications', 'trainingNotifications', e.target.checked)}
                  className="rounded"
                />
              </label>
            </div>
          </div>

          {/* Delivery Methods */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-green-600" />
              <span>Delivery Methods</span>
            </h4>
            <div className="space-y-2 pl-6">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 flex items-center space-x-2">
                  <Bell className="h-3 w-3" />
                  In-app notifications
                </span>
                <input 
                  type="checkbox" 
                  checked={settings.deliveryMethods.inApp}
                  onChange={(e) => updateSetting('deliveryMethods', 'inApp', e.target.checked)}
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 flex items-center space-x-2">
                  <Mail className="h-3 w-3" />
                  Email notifications
                </span>
                <input 
                  type="checkbox" 
                  checked={settings.deliveryMethods.email}
                  onChange={(e) => updateSetting('deliveryMethods', 'email', e.target.checked)}
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 flex items-center space-x-2">
                  <MessageSquare className="h-3 w-3" />
                  SMS alerts
                </span>
                <input 
                  type="checkbox" 
                  checked={settings.deliveryMethods.sms}
                  onChange={(e) => updateSetting('deliveryMethods', 'sms', e.target.checked)}
                  className="rounded"
                />
              </label>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Changes are saved automatically
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={saveSettings}>
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
