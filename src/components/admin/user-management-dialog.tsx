"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Users,
  Shield,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  status: "active" | "inactive" | "suspended"
  lastLogin: string
  createdAt: string
  permissions: string[]
}

interface UserManagementDialogProps {
  onUserCreated?: (user: User) => void
  onUserUpdated?: (user: User) => void
  onUserDeleted?: (userId: string) => void
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@firedepartment.com",
    phone: "+91 98765 43210",
    role: "Chief",
    department: "Operations",
    status: "active",
    lastLogin: "2025-01-09 14:30",
    createdAt: "2024-01-15",
    permissions: ["admin", "incident_management", "personnel_management"]
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@firedepartment.com",
    phone: "+91 98765 43211",
    role: "Captain",
    department: "Station 1",
    status: "active",
    lastLogin: "2025-01-09 13:45",
    createdAt: "2024-02-20",
    permissions: ["incident_management", "personnel_management"]
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.davis@firedepartment.com",
    phone: "+91 98765 43212",
    role: "Lieutenant",
    department: "Station 2",
    status: "active",
    lastLogin: "2025-01-09 12:15",
    createdAt: "2024-03-10",
    permissions: ["incident_management"]
  },
  {
    id: "4",
    name: "Lisa Wilson",
    email: "lisa.wilson@firedepartment.com",
    phone: "+91 98765 43213",
    role: "Firefighter",
    department: "Station 1",
    status: "inactive",
    lastLogin: "2025-01-08 16:20",
    createdAt: "2024-04-05",
    permissions: ["basic"]
  }
]

const roles = [
  { value: "Chief", label: "Chief", permissions: ["admin", "incident_management", "personnel_management", "system_settings"] },
  { value: "Captain", label: "Captain", permissions: ["incident_management", "personnel_management"] },
  { value: "Lieutenant", label: "Lieutenant", permissions: ["incident_management"] },
  { value: "Firefighter", label: "Firefighter", permissions: ["basic"] },
  { value: "Dispatcher", label: "Dispatcher", permissions: ["incident_management", "dispatch"] },
  { value: "Admin", label: "System Admin", permissions: ["admin", "system_settings", "user_management"] }
]

const departments = [
  "Operations",
  "Station 1", 
  "Station 2",
  "Station 3",
  "Dispatch Center",
  "Training",
  "Maintenance",
  "Administration"
]

export function UserManagementDialog({ onUserCreated, onUserUpdated, onUserDeleted }: UserManagementDialogProps) {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    status: "active" as "active" | "inactive" | "suspended"
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.role) {
      alert("Please fill in all required fields")
      return
    }

    const selectedRole = roles.find(r => r.value === formData.role)
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      status: formData.status,
      lastLogin: "Never",
      createdAt: new Date().toISOString().split('T')[0],
      permissions: selectedRole?.permissions || []
    }

    setUsers(prev => [...prev, newUser])
    
    if (onUserCreated) {
      onUserCreated(newUser)
    }

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      status: "active"
    })
    setShowAddForm(false)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      status: user.status
    })
    setShowAddForm(true)
  }

  const handleUpdateUser = () => {
    if (!editingUser || !formData.name || !formData.email || !formData.role) {
      alert("Please fill in all required fields")
      return
    }

    const selectedRole = roles.find(r => r.value === formData.role)
    const updatedUser: User = {
      ...editingUser,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      status: formData.status,
      permissions: selectedRole?.permissions || []
    }

    setUsers(prev => prev.map(u => u.id === editingUser.id ? updatedUser : u))
    
    if (onUserUpdated) {
      onUserUpdated(updatedUser)
    }

    setEditingUser(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      status: "active"
    })
    setShowAddForm(false)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(u => u.id !== userId))
      
      if (onUserDeleted) {
        onUserDeleted(userId)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success"
      case "inactive": return "secondary"
      case "suspended": return "destructive"
      default: return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "inactive": return <Clock className="h-4 w-4 text-gray-600" />
      case "suspended": return <XCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Manage Users
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>User Management</span>
          </DialogTitle>
          <DialogDescription>
            Manage system users, roles, and permissions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add/Edit User Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingUser ? "Edit User" : "Add New User"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={editingUser ? handleUpdateUser : handleAddUser}
                  >
                    {editingUser ? "Update User" : "Add User"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingUser(null)
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        role: "",
                        department: "",
                        status: "active"
                      })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">System Users</CardTitle>
                  <CardDescription>
                    {users.length} users in the system
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  disabled={showAddForm}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{user.name}</p>
                          {getStatusIcon(user.status)}
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.role} • {user.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Role Permissions</span>
              </CardTitle>
              <CardDescription>
                Permissions assigned to each role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.value} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{role.label}</h4>
                      <Badge variant="outline">{role.permissions.length} permissions</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
