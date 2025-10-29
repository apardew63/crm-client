"use client"

import React, { useState, useEffect } from "react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconSearch, IconFilter } from "@tabler/icons-react"

import data from "../app/dashboard/data.json"

// TaskTable component
function TaskTable({ tasks, loading, columns }) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data: tasks,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={(table.getColumn("title")?.getFilterValue()) ?? ""}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <IconFilter className="w-4 h-4 text-muted-foreground" />
            <Select
              value={(table.getColumn("status")?.getFilterValue()) ?? ""}
              onValueChange={(value) =>
                table.getColumn("status")?.setFilterValue(value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_status">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30 transition-colors duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                      <IconSearch className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p>No tasks assigned to you yet.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} task(s) selected.
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardContent() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [previousTaskStatuses, setPreviousTaskStatuses] = useState({})
  const { user, getToken } = useAuth()
  const URL = process.env.NEXT_PUBLIC_URL

  // Handle status update for individual tasks
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${URL}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update local state
        setTasks(prevTasks =>
          prevTasks.map(task =>
            (task._id || task.id) === taskId
              ? { ...task, status: newStatus }
              : task
          )
        )
        toast.success("Task status updated successfully")
      } else {
        toast.error(data.message || "Failed to update task status")
      }
    } catch (error) {
      console.error("Update task status error:", error)
      toast.error("Network error. Please try again.")
    }
  }

  // Handle starting a task
  const handleStartTask = async (taskId) => {
    try {
      const response = await fetch(`${URL}/api/tasks/${taskId}/start`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update local state - status should change to in_progress
        setTasks(prevTasks =>
          prevTasks.map(task =>
            (task._id || task.id) === taskId
              ? { ...task, status: 'in_progress', timeTracking: data.data.task.timeTracking }
              : task
          )
        )
        toast.success("Task started! Timer is now running.")
      } else {
        toast.error(data.message || "Failed to start task")
      }
    } catch (error) {
      console.error("Start task error:", error)
      toast.error("Network error. Please try again.")
    }
  }

  // Handle ending a task
  const handleEndTask = async (taskId) => {
    try {
      const response = await fetch(`${URL}/api/tasks/${taskId}/complete`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update local state - status should change to completed
        setTasks(prevTasks =>
          prevTasks.map(task =>
            (task._id || task.id) === taskId
              ? { ...task, status: 'completed', timeTracking: data.data.task.timeTracking, completedDate: new Date() }
              : task
          )
        )
        toast.success("Task completed successfully!")
      } else {
        toast.error(data.message || "Failed to complete task")
      }
    } catch (error) {
      console.error("Complete task error:", error)
      toast.error("Network error. Please try again.")
    }
  }

  // Check for task status changes and show notifications
  const checkForStatusChanges = (newTasks) => {
    const currentStatuses = {}
    newTasks.forEach(task => {
      currentStatuses[task._id || task.id] = task.status
    })

    // Compare with previous statuses
    Object.keys(currentStatuses).forEach(taskId => {
      const currentStatus = currentStatuses[taskId]
      const previousStatus = previousTaskStatuses[taskId]

      if (previousStatus && previousStatus !== currentStatus) {
        // Find the task details
        const task = newTasks.find(t => (t._id || t.id) === taskId)
        if (task) {
          const assigneeName = task.assignedTo ?
            `${task.assignedTo.firstName} ${task.assignedTo.lastName}` :
            'Unknown'

          toast.success(
            `Task "${task.title}" status changed from ${previousStatus.replace('_', ' ')} to ${currentStatus.replace('_', ' ')} by ${assigneeName}`,
            {
              duration: 5000,
              description: `Assigned to: ${assigneeName}`
            }
          )
        }
      }
    })

    // Update previous statuses
    setPreviousTaskStatuses(currentStatuses)
  }

  // Poll for task updates every 30 seconds
  useEffect(() => {
    // Only poll for users who can see tasks assigned by them (admins/PMs)
    const canSeeAssignedTasks = user && (
      user.role === 'admin' ||
      user.role === 'project_manager' ||
      (user.role === 'employee' && user.designation === 'project_manager')
    )

    if (!canSeeAssignedTasks) return

    const pollForUpdates = async () => {
      try {
        const response = await fetch(`${URL}/api/tasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            checkForStatusChanges(data.data.tasks)
            // Update tasks if needed (but don't override manual updates)
            setTasks(data.data.tasks)
          }
        }
      } catch (error) {
        console.error("Polling error:", error)
      }
    }

    // Initial poll after 5 seconds
    const initialTimeout = setTimeout(pollForUpdates, 5000)

    // Set up interval for every 30 seconds
    const interval = setInterval(pollForUpdates, 30000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [user, getToken, URL])

  // Task table columns
  const taskColumns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant={
              status === 'completed' ? 'success' :
              status === 'in_progress' ? 'info' :
              status === 'pending' ? 'outline' :
              'destructive'
            }
          >
            {status === 'in_progress' ? 'In Progress' :
             status === 'pending' ? 'To Do' :
             status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const startDate = row.getValue("startDate")
        if (!startDate) return <span className="text-muted-foreground">N/A</span>

        const date = new Date(startDate)
        return (
          <span>
            {date.toLocaleDateString()}
          </span>
        )
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const dueDate = row.getValue("dueDate")
        if (!dueDate) return <span className="text-muted-foreground">N/A</span>

        const date = new Date(dueDate)
        const today = new Date()
        const isOverdue = date < today && row.original.status !== 'completed'

        return (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {date.toLocaleDateString()}
          </span>
        )
      },
    },
    {
      accessorKey: "assignedBy",
      header: "Assigned By",
      cell: ({ row }) => {
        const assignedBy = row.getValue("assignedBy")
        if (!assignedBy) return <span className="text-muted-foreground">N/A</span>
        return `${assignedBy.firstName} ${assignedBy.lastName}`
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const task = row.original;
        const status = task.status;
        const isAssignedToCurrentUser = task.assignedTo && task.assignedTo._id === user._id;

        if (!isAssignedToCurrentUser) {
          return <span className="text-muted-foreground text-sm">Not assigned to you</span>;
        }

        if (status === 'completed') {
          return <Badge variant="success" size="sm">✓ Completed</Badge>;
        }

        return (
          <div className="flex gap-2">
            {status === 'pending' && (
              <Button
                size="sm"
                onClick={() => handleStartTask(task._id || task.id)}
                variant="default"
              >
                Start Task
              </Button>
            )}
            {status === 'in_progress' && (
              <Button
                size="sm"
                onClick={() => handleEndTask(task._id || task.id)}
                variant="destructive"
              >
                End Task
              </Button>
            )}
          </div>
        );
      },
    },
    {
      id: "timeSpent",
      header: "Time Spent",
      cell: ({ row }) => {
        const task = row.original;
        const timeTracking = task.timeTracking || {};
        const totalTimeSpent = timeTracking.totalTimeSpent || 0;

        if (totalTimeSpent === 0) {
          return <span className="text-muted-foreground">Not started</span>;
        }

        // Convert milliseconds to hours and days
        const hours = Math.floor(totalTimeSpent / (1000 * 60 * 60));
        const remainingMs = totalTimeSpent % (1000 * 60 * 60);
        const minutes = Math.floor(remainingMs / (1000 * 60));

        if (hours >= 24) {
          const days = Math.floor(hours / 24);
          const remainingHours = hours % 24;
          return (
            <span className="font-medium">
              {days}d {remainingHours}h {minutes}m
            </span>
          );
        } else {
          return (
            <span className="font-medium">
              {hours}h {minutes}m
            </span>
          );
        }
      },
    },
  ]

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user || !getToken()) return

      try {
        const response = await fetch(`${URL}/api/tasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
          },
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setTasks(data.data.tasks)
          // Initialize previous task statuses for comparison
          const initialStatuses = {}
          data.data.tasks.forEach(task => {
            initialStatuses[task._id || task.id] = task.status
          })
          setPreviousTaskStatuses(initialStatuses)
        } else {
          toast.error(data.message || "Failed to fetch tasks")
        }
      } catch (error) {
        console.error("Fetch tasks error:", error)
        toast.error("Network error. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [user, getToken, URL])

  // Check if user can view admin-level dashboard components
  const canViewAdminComponents = user && (
    user.role === 'admin' ||
    (user.role === 'employee' && user.designation === 'project_manager')
  )

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Only show SectionCards and ChartAreaInteractive for admin or project manager employees */}
      {canViewAdminComponents && (
        <>
          <SectionCards />
          <Card className="p-6">
            <ChartAreaInteractive />
          </Card>
        </>
      )}

      {/* Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">My Tasks</h2>
            <p className="text-muted-foreground">
              Manage and track your assigned tasks
            </p>
          </div>
        </div>
        <TaskTable tasks={tasks} loading={loading} columns={taskColumns} />
      </div>
    </div>
  );
}