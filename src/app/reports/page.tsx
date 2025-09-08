"use client"

import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Truck,
  Clock,
  FileText,
  Filter
} from "lucide-react"
import { useState } from "react"

// Mock data for reports
const mockKPIs = {
  totalIncidents: 156,
  averageResponseTime: 4.2,
  personnelOnDuty: 24,
  vehiclesInService: 8,
  incidentsThisMonth: 23,
  incidentsLastMonth: 18,
  responseTimeThisMonth: 4.1,
  responseTimeLastMonth: 4.5
}

const mockIncidentTypes = [
  { type: "Fire", count: 45, percentage: 28.8, trend: "up" },
  { type: "Medical", count: 67, percentage: 42.9, trend: "up" },
  { type: "Rescue", count: 23, percentage: 14.7, trend: "down" },
  { type: "Hazmat", count: 8, percentage: 5.1, trend: "stable" },
  { type: "False Alarm", count: 13, percentage: 8.3, trend: "down" }
]

const mockMonthlyData = [
  { month: "Jan", incidents: 18, responseTime: 4.8 },
  { month: "Feb", incidents: 22, responseTime: 4.5 },
  { month: "Mar", incidents: 19, responseTime: 4.2 },
  { month: "Apr", incidents: 25, responseTime: 4.1 },
  { month: "May", incidents: 23, responseTime: 4.2 }
]

const mockStationPerformance = [
  { station: "Station 1", incidents: 45, avgResponseTime: 3.8, personnel: 8, vehicles: 3 },
  { station: "Station 2", incidents: 38, avgResponseTime: 4.1, personnel: 6, vehicles: 2 },
  { station: "Station 3", incidents: 42, avgResponseTime: 4.5, personnel: 10, vehicles: 4 }
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-red-500" />
      case "down": return <TrendingDown className="h-4 w-4 text-green-500" />
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-red-600"
      case "down": return "text-green-600"
      default: return "text-gray-600"
    }
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Fire department performance metrics and insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Period:</span>
          {["week", "month", "quarter", "year"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockKPIs.totalIncidents}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {getTrendIcon("up")}
                <span className={getTrendColor("up")}>+27.8% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockKPIs.averageResponseTime}m</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {getTrendIcon("down")}
                <span className={getTrendColor("down")}>-8.9% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Personnel On Duty</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockKPIs.personnelOnDuty}</div>
              <p className="text-xs text-muted-foreground">
                12 available for dispatch
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicles In Service</CardTitle>
              <Truck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockKPIs.vehiclesInService}</div>
              <p className="text-xs text-muted-foreground">
                2 out of service for maintenance
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incident Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Incident Types</span>
              </CardTitle>
              <CardDescription>
                Distribution of incident types this month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockIncidentTypes.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.count}</span>
                    <span className="text-xs text-gray-500">({item.percentage}%)</span>
                    {getTrendIcon(item.trend)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Monthly Trends</span>
              </CardTitle>
              <CardDescription>
                Incident volume and response time trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMonthlyData.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{month.month}</p>
                      <p className="text-sm text-gray-600">{month.incidents} incidents</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{month.responseTime}m</p>
                      <p className="text-sm text-gray-600">avg response</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Station Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Station Performance</span>
            </CardTitle>
            <CardDescription>
              Performance metrics by station
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Station</th>
                    <th className="text-left py-3 px-4">Incidents</th>
                    <th className="text-left py-3 px-4">Avg Response Time</th>
                    <th className="text-left py-3 px-4">Personnel</th>
                    <th className="text-left py-3 px-4">Vehicles</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStationPerformance.map((station, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4 font-medium">{station.station}</td>
                      <td className="py-3 px-4">{station.incidents}</td>
                      <td className="py-3 px-4">
                        <Badge variant={station.avgResponseTime < 4 ? "success" : "warning"}>
                          {station.avgResponseTime}m
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{station.personnel}</td>
                      <td className="py-3 px-4">{station.vehicles}</td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Report</CardTitle>
              <CardDescription>Today's incident summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">Total incidents: 3</p>
                <p className="text-sm">Active incidents: 2</p>
                <p className="text-sm">Personnel on duty: 24</p>
                <p className="text-sm">Vehicles in service: 8</p>
              </div>
              <Button className="w-full mt-4" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Summary</CardTitle>
              <CardDescription>This week's performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">Total incidents: 18</p>
                <p className="text-sm">Avg response time: 4.1m</p>
                <p className="text-sm">Most common: Medical (42%)</p>
                <p className="text-sm">Peak hours: 2-4 PM</p>
              </div>
              <Button className="w-full mt-4" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Analysis</CardTitle>
              <CardDescription>Comprehensive monthly report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">Total incidents: 156</p>
                <p className="text-sm">Response time trend: -8.9%</p>
                <p className="text-sm">Top station: Station 1</p>
                <p className="text-sm">Training hours: 240</p>
              </div>
              <Button className="w-full mt-4" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
