"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Trophy, TrendingUp, Clock, CheckCircle, Target, Award } from 'lucide-react'
import { toast } from 'sonner'

export function EmployeeOfMonth() {
  const { getToken } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployeeOfMonth()
  }, [])

  const fetchEmployeeOfMonth = async () => {
    try {
      const token = getToken()
      if (!token) return

      const response = await fetch('http://localhost:5000/api/tasks/employee-of-month', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      } else {
        console.error('Failed to fetch employee of the month')
      }
    } catch (error) {
      console.error('Error fetching employee of the month:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Employee of the Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data?.employeeOfTheMonth) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Employee of the Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No data available for this period
          </p>
        </CardContent>
      </Card>
    )
  }

  const winner = data.employeeOfTheMonth

  return (
    <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-600" />
          <span className="text-yellow-800">Employee of the Month</span>
        </CardTitle>
        <CardDescription>
          {new Date(data.periodStart).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Winner Card */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-yellow-200">
          <Avatar className="h-16 w-16 ring-4 ring-yellow-400">
            <AvatarFallback className="bg-yellow-600 text-white text-xl font-bold">
              {winner.user.firstName[0]}{winner.user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">
              {winner.user.firstName} {winner.user.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{winner.user.designation}</p>
            <div className="flex items-center gap-2 mt-1">
              <Award className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">
                Score: {winner.totalScore} points
              </span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-lg border text-center">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{winner.tasksCompleted}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="bg-white p-3 rounded-lg border text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{winner.onTimeRate}%</div>
            <div className="text-xs text-muted-foreground">On Time</div>
          </div>
          <div className="bg-white p-3 rounded-lg border text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{winner.completionRate}%</div>
            <div className="text-xs text-muted-foreground">Completion</div>
          </div>
          <div className="bg-white p-3 rounded-lg border text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{winner.totalHoursWorked}h</div>
            <div className="text-xs text-muted-foreground">Hours</div>
          </div>
        </div>

        {/* Top Performers */}
        {data.topPerformers?.length > 1 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Top Performers</h4>
            <div className="space-y-2">
              {data.topPerformers.slice(1, 5).map((performer, index) => (
                <div 
                  key={performer.user._id} 
                  className="flex items-center justify-between p-2 bg-white rounded border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                      {index + 2}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {performer.user.firstName[0]}{performer.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {performer.user.firstName} {performer.user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{performer.user.designation}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {performer.totalScore} pts
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
