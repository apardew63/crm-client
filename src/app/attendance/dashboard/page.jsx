"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function AttendanceDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <AttendanceDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function AttendanceDashboard() {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const previousCountRef = useRef(0);

  useEffect(() => {
    fetchAttendances();
    const interval = setInterval(fetchAttendances, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAttendances = async () => {
    try {
      const response = await fetch('https://crm-server-chi.vercel.app/api/attendance', {
        headers: {
          'Authorization': 'FACE_SECRET_123'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch attendances: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      previousCountRef.current = attendances.length;
      setAttendances(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2">Loading attendance records...</span>
    </motion.div>
  );

  if (error) return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-6"
    >
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-6 max-sm:p-0 space-y-6 max-w-8xl"
    >
      <div className="flex items-center justify-between max-sm:flex-col max-sm:justify-start max-sm:text-left max-sm:items-start max-sm:space-y-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-green-600" />
            Live Attendance Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time attendance records from face recognition system
          </p>
        </div>
      </div>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            Latest attendance entries (updates every 5 seconds)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attendances.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No Attendance Records</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No attendance has been logged yet. Run the face recognition system to start logging.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Name</th>
                    <th className="text-left p-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.map((att, index) => (
                    <tr
                      key={att._id || index}
                      className={`border-b transition-colors ${
                        index < attendances.length - previousCountRef.current ? 'bg-yellow-100' : ''
                      }`}
                    >
                      <td className="p-2">{att.name}</td>
                      <td className="p-2">{att.timestamp.split(' ')[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
