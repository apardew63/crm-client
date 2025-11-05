"use client"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Plus,
  Search,
  Edit,
  Eye,
  Play,
  Square,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Target,
  TrendingUp,
  UserPlus,
  X,
  AlertCircle,
  Calendar,
  Timer,
  Award
} from "lucide-react"
import { FiTrendingUp, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi"
import { BiTask } from "react-icons/bi"
import { MdOutlinePlayArrow, MdOutlineStop, MdOutlineCheckCircle } from "react-icons/md"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <TasksPageContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function TasksPageContent() {
  const { user, getToken } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterPriority, setFilterPriority] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  // Update progress state when task is selected
  useEffect(() => {
    if (selectedTask) {
      setProgressUpdate({
        percentage: selectedTask.progress?.percentage || 0,
        phase: selectedTask.progress?.currentPhase || 'planning'
      });
    }
  }, [selectedTask]);
  const [stats, setStats] = useState(null)
  const [employees, setEmployees] = useState([])
  const [projects, setProjects] = useState([])
  const [actionLoading, setActionLoading] = useState(null)
  const [progressUpdate, setProgressUpdate] = useState({ percentage: 0, phase: 'planning' })
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: [],
    dueDate: "",
    priority: "medium",
    category: "",
    estimatedHours: "",
    project: ""
  })

  useEffect(() => {
    fetchTasks()
    fetchEmployees()
    fetchProjects()
    fetchStats()
  }, [])

  const fetchEmployees = async () => {
    try {
      const token = getToken()
      if (!token) {
        console.error("No authentication token found")
        return
      }

      const response = await fetch("https://crm-server-chi.vercel.app/api/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Employees fetched successfully:", data.data?.employees?.length || 0, "employees")
        setEmployees(data.data?.employees || [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Failed to fetch employees:", response.status, errorData)
        toast.error("Failed to load employees")
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast.error("Error loading employees")
    }
  }

  const fetchProjects = async () => {
    try {
      const token = getToken()
      if (!token) {
        console.error("No authentication token found")
        return
      }

      const response = await fetch("https://crm-server-chi.vercel.app/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Projects fetched successfully:", data.data?.projects?.length || 0, "projects")
        setProjects(data.data?.projects || [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Failed to fetch projects:", response.status, errorData)
        // Projects are optional, so don't show error toast
        setProjects([])
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      setProjects([])
    }
  }

  const fetchTasks = async () => {
    try {
      const token = getToken()
      if (!token) {
        console.error("No authentication token found")
        setLoading(false)
        return
      }

      const response = await fetch("https://crm-server-chi.vercel.app/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Tasks fetched successfully:", data.data?.tasks?.length || 0, "tasks")
        setTasks(data.data?.tasks || [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Failed to fetch tasks:", response.status, errorData)
        toast.error("Failed to load tasks")
        setTasks([])
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast.error("Error loading tasks")
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = getToken()
      if (!token) {
        console.error("No authentication token found")
        return
      }

      const response = await fetch("https://crm-server-chi.vercel.app/api/tasks/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Task stats fetched successfully")
        setStats(data.data?.stats || null)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Failed to fetch task stats:", response.status, errorData)
        setStats(null)
      }
    } catch (error) {
      console.error("Error fetching task stats:", error)
      setStats(null)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const title = (task.title || "").toLowerCase()
    const description = (task.description || "").toLowerCase()
    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase())

    const matchesStatus = !filterStatus || filterStatus === "all" || task.status === filterStatus
    const matchesPriority = !filterPriority || filterPriority === "all" || task.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = status => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "pending":
        return <FileText className="w-4 h-4 text-gray-500" />
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = priority => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const handleStartTask = async taskId => {
    setActionLoading(taskId)
    try {
      const token = getToken()
      if (!token) {
        toast.error("Authentication required")
        return
      }

      const response = await fetch(`https://crm-server-chi.vercel.app/api/tasks/${taskId}/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        fetchTasks()
        fetchStats()
        toast.success("Task started successfully")
      } else if (response.status === 403) {
        toast.error("You don't have permission to start this task.")
      } else {
        toast.error("Failed to start task. Please try again.")
      }
    } catch (error) {
      console.error("Error starting task:", error)
      toast.error("An error occurred while starting the task.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleStopTask = async taskId => {
    setActionLoading(taskId)
    try {
      const token = getToken()
      if (!token) {
        toast.error("Authentication required")
        return
      }

      const response = await fetch(`https://crm-server-chi.vercel.app/api/tasks/${taskId}/stop`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        fetchTasks()
        fetchStats()
        toast.success("Task timer stopped")
      } else if (response.status === 403) {
        toast.error("You don't have permission to stop this task.")
      } else {
        toast.error("Failed to stop task. Please try again.")
      }
    } catch (error) {
      console.error("Error stopping task:", error)
      toast.error("An error occurred while stopping the task.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleCompleteTask = async taskId => {
    setActionLoading(taskId)
    try {
      const token = getToken()
      if (!token) {
        toast.error("Authentication required")
        return
      }

      const response = await fetch(`https://crm-server-chi.vercel.app/api/tasks/${taskId}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        fetchTasks()
        fetchStats()
        toast.success("Task completed successfully")
      } else if (response.status === 403) {
        toast.error("You don't have permission to complete this task.")
      } else {
        toast.error("Failed to complete task. Please try again.")
      }
    } catch (error) {
      console.error("Error completing task:", error)
      toast.error("An error occurred while completing the task.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreateTask = async e => {
    e.preventDefault()
    try {
      const taskData = {
        ...newTask,
        assignedTo: newTask.assignedTo.filter(id => id), // Remove empty values
        project: newTask.project === "none" ? "" : newTask.project // Convert "none" to empty string
      }

      const token = getToken()
      if (!token) {
        toast.error("Authentication required")
        return
      }

      const response = await fetch("https://crm-server-chi.vercel.app/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      })

      if (response.ok) {
        setShowCreateModal(false)
        setNewTask({
          title: "",
          description: "",
          assignedTo: [],
          dueDate: "",
          priority: "medium",
          category: "",
          estimatedHours: "",
          project: ""
        })
        fetchTasks()
        fetchStats()
        toast.success("Task created successfully")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to create task")
      }
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error("Failed to create task")
    }
  }

  const handleAddAssignee = async (taskId, userId) => {
    try {
      const token = getToken()
      if (!token) {
        toast.error("Authentication required")
        return
      }

      const response = await fetch(`https://crm-server-chi.vercel.app/api/tasks/${taskId}/assignees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        fetchTasks()
        toast.success("Assignee added successfully")
      } else {
        toast.error("Failed to add assignee")
      }
    } catch (error) {
      console.error("Error adding assignee:", error)
      toast.error("Failed to add assignee")
    }
  }

  const handleRemoveAssignee = async (taskId, userId) => {
    try {
      const token = getToken()
      if (!token) {
        toast.error("Authentication required")
        return
      }

      const response = await fetch(`https://crm-server-chi.vercel.app/api/tasks/${taskId}/assignees`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        fetchTasks()
        toast.success("Assignee removed successfully")
      } else {
        toast.error("Failed to remove assignee")
      }
    } catch (error) {
      console.error("Error removing assignee:", error)
      toast.error("Failed to remove assignee")
    }
  }

  const handleUpdateProgress = useCallback(async (taskId, percentage, phase) => {
    try {
      const token = getToken()
      if (!token) {
        toast.error("Authentication required")
        return
      }

      const response = await fetch(`https://crm-server-chi.vercel.app/api/tasks/${taskId}/progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ percentage: parseInt(percentage), phase })
      })

      if (response.ok) {
        await fetchTasks()
        await fetchStats()
        toast.success(`Progress updated to ${percentage}% - ${phase} phase`)
        setSelectedTask(null)
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.error || "Failed to update progress")
      }
    } catch (error) {
      console.error("Error updating progress:", error)
      toast.error("Failed to update progress")
    }
  }, [getToken])

  const getPhaseColor = (phase) => {
    switch(phase) {
      case 'planning': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'development': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'testing': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'review': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'deployment': return 'bg-green-50 text-green-700 border-green-200'
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPhaseIcon = (phase) => {
    switch(phase) {
      case 'planning': return '📋'
      case 'development': return '💻'
      case 'testing': return '🧪'
      case 'review': return '👁️'
      case 'deployment': return '🚀'
      case 'completed': return '✅'
      default: return '📄'
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case 'completed': return 'default'
      case 'in_progress': return 'secondary'
      case 'overdue': return 'destructive'
      default: return 'outline'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  const canCreateTasks = user?.role === 'admin' ||
    user?.role === 'project_manager' ||
    (user?.role === 'employee' && user?.designation === 'project_manager');

  const canManageTasks = user?.role === 'admin' ||
    user?.role === 'project_manager' ||
    (user?.role === 'employee' && user?.designation === 'project_manager');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-6 max-sm:p-0 space-y-6 max-w-8xl"
    >
      <div className="flex items-center justify-between max-sm:flex-col max-sm:justify-start max-sm:text-left max-sm:items-start max-sm:space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Task Management</h1>
          <p className="text-muted-foreground">
            Manage and track all tasks with multiple assignees and progress monitoring
          </p>
        </div>
        {canCreateTasks && (
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Create a task and assign it to one or more team members
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project">Project (Optional)</Label>
                    <Select value={newTask.project} onValueChange={(value) => setNewTask({...newTask, project: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Project</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project._id} value={project._id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedHours">Estimated Hours</Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      value={newTask.estimatedHours}
                      onChange={(e) => setNewTask({...newTask, estimatedHours: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Assign To (Select one or more employees)</Label>
                  <div className="border rounded-lg p-3 space-y-2">
                    {newTask.assignedTo.map((userId, index) => {
                      const employee = employees.find(e => e._id === userId);
                      return (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <div>
                            <span className="font-medium">{employee?.firstName} {employee?.lastName}</span>
                            <span className="text-sm text-muted-foreground ml-2">- {employee?.designation}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = newTask.assignedTo.filter((_, i) => i !== index);
                              setNewTask({...newTask, assignedTo: updated});
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                    <Select
                      onValueChange={(value) => {
                        if (value && !newTask.assignedTo.includes(value)) {
                          setNewTask({
                            ...newTask,
                            assignedTo: [...newTask.assignedTo, value]
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee(s)" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees
                          .filter(emp => !newTask.assignedTo.includes(emp._id))
                          .map((emp) => (
                            <SelectItem key={emp._id} value={emp._id}>
                              {emp.firstName} {emp.lastName} - {emp.designation}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Task</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards with Animation */}
      {stats && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="border-l-4 border-l-slate-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Tasks</CardTitle>
              <BiTask className="h-5 w-5 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-700">{stats.totalTasks || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">All assigned tasks</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">In Progress</CardTitle>
              <FiClock className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.byStatus?.in_progress || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently active</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Completed</CardTitle>
              <FiCheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.byStatus?.completed || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully finished</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Overdue</CardTitle>
              <FiAlertCircle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.overdueTasks || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            {filteredTasks.length} of {tasks.length} tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No tasks found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assignees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Phase</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {task.description}
                          </div>
                          {task.project && (
                            <Badge variant="outline" className="mt-1">
                              {task.project.name}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {task.assignedTo?.map((assignee, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {assignee.user?.firstName} {assignee.user?.lastName}
                            </Badge>
                          )) || <span className="text-muted-foreground">Unassigned</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0.8 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge className={`${getPhaseColor(task.progress?.currentPhase || 'planning')} border px-3 py-1 font-medium`}>
                            {getPhaseIcon(task.progress?.currentPhase || 'planning')} {task.progress?.currentPhase || 'planning'}
                          </Badge>
                        </motion.div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={task.progress?.percentage || 0} className="w-16" />
                          <div className="text-xs text-muted-foreground">
                            {task.progress?.percentage || 0}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTask(task)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {/* Action buttons for assigned users */}
                          {task.assignedTo?.some(a => a?.user?._id === user?._id) && user?.role !== 'admin' && (
                            <>
                              {task.status === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStartTask(task._id)}
                                  disabled={actionLoading === task._id}
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              )}
                              {task.status === 'in_progress' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStopTask(task._id)}
                                    disabled={actionLoading === task._id}
                                  >
                                    <Square className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCompleteTask(task._id)}
                                    disabled={actionLoading === task._id}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Details Dialog */}
      <AnimatePresence>
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => {
          setSelectedTask(null);
          setProgressUpdate({ percentage: 0, phase: 'planning' });
        }}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTask.title}</DialogTitle>
              <DialogDescription>{selectedTask.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Task Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{selectedTask.progress?.percentage || 0}%</div>
                  <div className="text-sm text-muted-foreground">Progress</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{selectedTask.assignedTo?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Assignees</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{selectedTask.timeTracking?.totalTimeSpent ? Math.round(selectedTask.timeTracking.totalTimeSpent / (1000 * 60 * 60)) : 0}h</div>
                  <div className="text-sm text-muted-foreground">Time Spent</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{selectedTask.daysUntilDue || 0}</div>
                  <div className="text-sm text-muted-foreground">Days Left</div>
                </div>
              </div>

              {/* Task Details */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Task Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant={
                          selectedTask.status === 'completed' ? 'default' :
                          selectedTask.status === 'in_progress' ? 'secondary' :
                          selectedTask.status === 'overdue' ? 'destructive' : 'outline'
                        }
                      >
                        {selectedTask.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge className={getPriorityColor(selectedTask.priority)}>
                        {selectedTask.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span>{new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Hours:</span>
                      <span>{selectedTask.estimatedHours || '-'}</span>
                    </div>
                    {selectedTask.project && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Project:</span>
                        <span>{selectedTask.project.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Assignees</h3>
                  <div className="space-y-2">
                    {selectedTask.assignedTo?.map((assignee, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div>
                          <div className="font-medium">
                            {assignee.user?.firstName} {assignee.user?.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {assignee.role}
                          </div>
                        </div>
                        <Badge variant="outline">{assignee.user?.designation}</Badge>
                      </div>
                    )) || (
                      <div className="text-muted-foreground">No assignees</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Update Section */}
              {(selectedTask.assignedTo?.some(a => a?.user?._id === user?._id) || canManageTasks) && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Update Progress
                    </h3>
                    <Badge className={`${getPhaseColor(selectedTask.progress?.currentPhase || 'planning')} border text-xs px-3 py-1`}>
                      {getPhaseIcon(selectedTask.progress?.currentPhase || 'planning')} Current: {selectedTask.progress?.currentPhase || 'planning'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="progress" className="text-sm font-medium">Progress Percentage</Label>
                      <Input
                        id="progress"
                        type="number"
                        min="0"
                        max="100"
                        value={progressUpdate.percentage}
                        onChange={(e) => setProgressUpdate({ ...progressUpdate, percentage: e.target.value })}
                        placeholder="0-100"
                        className="text-center font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phase" className="text-sm font-medium">Task Phase</Label>
                      <Select 
                        value={progressUpdate.phase} 
                        onValueChange={(value) => setProgressUpdate({ ...progressUpdate, phase: value })}
                      >
                        <SelectTrigger className="font-medium">
                          <SelectValue placeholder="Select phase" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">📋 Planning</SelectItem>
                          <SelectItem value="development">💻 Development</SelectItem>
                          <SelectItem value="testing">🧪 Testing</SelectItem>
                          <SelectItem value="review">👁️ Review</SelectItem>
                          <SelectItem value="deployment">🚀 Deployment</SelectItem>
                          <SelectItem value="completed">✅ Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Progress value={progressUpdate.percentage} className="h-3" />
                  <Button 
                    onClick={() => {
                      handleUpdateProgress(
                        selectedTask._id,
                        progressUpdate.percentage,
                        progressUpdate.phase
                      );
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                    disabled={actionLoading === selectedTask._id}
                  >
                    {actionLoading === selectedTask._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiTrendingUp className="mr-2 h-4 w-4" />
                        Update Task Progress
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Time Tracking Sessions for Managers/Admin */}
              {canManageTasks && selectedTask.timeTracking && selectedTask.timeTracking.length > 0 && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Timer className="h-5 w-5 text-emerald-600" />
                    Time Tracking Sessions
                  </h3>
                  <div className="space-y-3">
                    {selectedTask.timeTracking.map((tracker, index) => {
                      const user = selectedTask.assignedTo?.find(a => a.user._id === tracker.user)?. user;
                      const totalHours = (tracker.totalTimeSpent / (1000 * 60 * 60)).toFixed(2);
                      return (
                        <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-slate-900">
                              {user?.firstName} {user?.lastName}
                            </div>
                            <Badge variant={tracker.isActive ? "default" : "outline"} className="text-xs">
                              {tracker.isActive ? "Active" : "Stopped"}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Total Time:</span>
                              <span className="font-semibold">{totalHours}h</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Sessions:</span>
                              <span className="font-semibold">{tracker.sessions?.length || 0}</span>
                            </div>
                            {tracker.isActive && tracker.currentSessionStart && (
                              <div className="flex justify-between text-emerald-600 font-medium">
                                <span>Started:</span>
                                <span>{new Date(tracker.currentSessionStart).toLocaleTimeString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      </AnimatePresence>
    </motion.div>
  )
}
