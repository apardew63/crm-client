"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Award,
  Trophy,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Target,
  Calendar
} from "lucide-react"
import { FiAward, FiTrendingUp } from "react-icons/fi"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

export default function EmployeeOfMonthPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <EmployeeOfMonthContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function EmployeeOfMonthContent() {
  const { user, getToken } = useAuth()
  const [employeeOfMonth, setEmployeeOfMonth] = useState(null)
  const [topPerformers, setTopPerformers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  useEffect(() => {
    fetchEmployeeOfMonth()
  }, [selectedMonth])

  const fetchEmployeeOfMonth = async () => {
    try {
      setLoading(true)
      const token = getToken()
      if (!token) {
        console.error("No authentication token found")
        return
      }

      const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).toISOString()
      const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).toISOString()

      const response = await fetch(
        `http://localhost:5000/api/tasks/employee-of-month?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setEmployeeOfMonth(data.data?.employeeOfTheMonth || null)
        setTopPerformers(data.data?.topPerformers || [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Failed to fetch employee of the month:", response.status, errorData)
        toast.error("Failed to load employee of the month data")
      }
    } catch (error) {
      console.error("Error fetching employee of the month:", error)
      toast.error("Error loading employee of the month data")
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const getRankBadgeColor = (rank) => {
    switch(rank) {
      case 1: return "bg-yellow-500 text-white"
      case 2: return "bg-gray-400 text-white"
      case 3: return "bg-amber-700 text-white"
      default: return "bg-slate-200 text-slate-700"
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-6 space-y-6 max-w-7xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Employee of the Month
          </h1>
          <p className="text-muted-foreground mt-1">
            Celebrating our top performers - {selectedMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))}
          >
            Previous Month
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedMonth(new Date())}
          >
            Current Month
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)))}
            disabled={new Date(selectedMonth).getMonth() >= new Date().getMonth()}
          >
            Next Month
          </Button>
        </div>
      </div>

      {/* Employee of the Month Showcase */}
      {employeeOfMonth ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-4 border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50">
            <CardHeader>
              <CardTitle className="text-center text-2xl flex items-center justify-center gap-3">
                <FiAward className="h-8 w-8 text-yellow-600" />
                Employee of the Month
                <FiAward className="h-8 w-8 text-yellow-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <Avatar className="h-40 w-40 border-4 border-yellow-500 shadow-xl">
                    <AvatarImage src={employeeOfMonth.user?.avatar} alt={`${employeeOfMonth.user?.firstName} ${employeeOfMonth.user?.lastName}`} />
                    <AvatarFallback className="text-4xl bg-yellow-100 text-yellow-700">
                      {getInitials(employeeOfMonth.user?.firstName, employeeOfMonth.user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">
                      {employeeOfMonth.user?.firstName} {employeeOfMonth.user?.lastName}
                    </h2>
                    <p className="text-lg text-slate-600 mt-1">{employeeOfMonth.user?.designation}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600">{employeeOfMonth.tasksCompleted}</div>
                      <div className="text-xs text-muted-foreground">Tasks Completed</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">{employeeOfMonth.totalScore}</div>
                      <div className="text-xs text-muted-foreground">Total Score</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-purple-600">{employeeOfMonth.onTimeRate}%</div>
                      <div className="text-xs text-muted-foreground">On-Time Rate</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-amber-600">{employeeOfMonth.totalHoursWorked}h</div>
                      <div className="text-xs text-muted-foreground">Hours Worked</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {employeeOfMonth.completionRate}% Completion Rate
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                      <Target className="h-3 w-3 mr-1" />
                      {employeeOfMonth.averageProgress}% Avg Progress
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                      <Star className="h-3 w-3 mr-1" />
                      {employeeOfMonth.onTimeCompletions} On-Time Tasks
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Data Available</h3>
            <p className="text-muted-foreground">
              No completed tasks found for this month
            </p>
          </CardContent>
        </Card>
      )}

      {/* Top Performers Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiTrendingUp className="h-5 w-5 text-emerald-600" />
            Top Performers Leaderboard
          </CardTitle>
          <CardDescription>Top 5 employees based on task completion and quality</CardDescription>
        </CardHeader>
        <CardContent>
          {topPerformers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No performance data available
            </div>
          ) : (
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getRankBadgeColor(index + 1)}`}>
                    {index + 1}
                  </div>

                  <Avatar className="h-12 w-12">
                    <AvatarImage src={performer.user?.avatar} alt={`${performer.user?.firstName} ${performer.user?.lastName}`} />
                    <AvatarFallback>
                      {getInitials(performer.user?.firstName, performer.user?.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">
                      {performer.user?.firstName} {performer.user?.lastName}
                    </div>
                    <div className="text-sm text-slate-600">{performer.user?.designation}</div>
                  </div>

                  <div className="hidden md:grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-slate-700">{performer.tasksCompleted}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{performer.totalScore}</div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{performer.onTimeRate}%</div>
                      <div className="text-xs text-muted-foreground">On-Time</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-amber-600">{performer.totalHoursWorked}h</div>
                      <div className="text-xs text-muted-foreground">Hours</div>
                    </div>
                  </div>

                  {index < 3 && (
                    <div className="flex-shrink-0">
                      {index === 0 && <Trophy className="h-8 w-8 text-yellow-500" />}
                      {index === 1 && <Trophy className="h-8 w-8 text-gray-400" />}
                      {index === 2 && <Trophy className="h-8 w-8 text-amber-700" />}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
