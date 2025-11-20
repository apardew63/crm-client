"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, AlertCircle, Upload, FileText, CheckCircle2, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function AttendancePage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <AttendanceContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function AttendanceContent() {
  const { user, getToken } = useAuth();
  const [pdfFiles, setPdfFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [attendances, setAttendances] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [attendanceError, setAttendanceError] = useState(null);
  const [previousCount, setPreviousCount] = useState(0);

  const isAdmin = user?.role === 'admin';
  const isProjectManager = user?.role === 'project_manager' || 
    (user?.role === 'employee' && user?.designation === 'project_manager');

  // Load uploaded PDF files
  const loadPdfFiles = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch('https://crm-server-chi.vercel.app/api/attendance/uploaded-pdfs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load PDF files');
      }

      const result = await response.json();
      if (result.success) {
        setPdfFiles(result.data.files);
      } else {
        throw new Error(result.error || 'Failed to load PDF files');
      }
    } catch (err) {
      console.error('Error loading PDF files:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload PDF file (Project Manager)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
      setSelectedFile(null);
    }
  };

  const uploadPdf = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file first');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('https://crm-server-chi.vercel.app/api/attendance/upload-pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload PDF');
      }

      const result = await response.json();
      toast.success(`PDF uploaded successfully! ${result.data?.processedRecords || 0} records processed`);
      setSelectedFile(null);
      setUploadProgress(100);
      // Reload PDF list if admin
      if (isAdmin) {
        await loadPdfFiles();
      }
    } catch (err) {
      console.error('Error uploading PDF:', err);
      toast.error(err.message || 'Failed to upload PDF');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  // Download PDF file (Admin)
  const downloadPdf = async (filename) => {
    try {
      const token = await getToken();
      const response = await fetch(`https://crm-server-chi.vercel.app/api/attendance/download-pdf/${encodeURIComponent(filename)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('PDF downloaded successfully');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast.error('Failed to download PDF');
    }
  };

  // Fetch live attendance records
  const fetchAttendances = async () => {
    try {
      const response = await fetch('https://adnan4498-infinitum-crm-server-glob.vercel.app/api/attendance', {
        headers: {
          'Authorization': 'Bearer FACE_SECRET_123'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch attendances');
      }
      const data = await response.json();
      setPreviousCount(attendances.length);
      setAttendances(data);
    } catch (err) {
      setAttendanceError(err.message);
    } finally {
      setAttendanceLoading(false);
    }
  };


  // Load PDF files and attendances on component mount
  useEffect(() => {
    if (isAdmin) {
      loadPdfFiles();
    } else {
      setLoading(false);
    }
    fetchAttendances();
    const interval = setInterval(fetchAttendances, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [isAdmin]);

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
            <FileText className="h-8 w-8 text-blue-600" />
            Attendance Management
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? 'Download attendance PDF files uploaded by project managers'
              : 'Upload attendance PDF files for processing'
            }
          </p>
        </div>
        {isAdmin && (
          <Button onClick={loadPdfFiles} variant="outline" disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            {loading ? 'Loading...' : 'Refresh PDFs'}
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Section for Project Managers */}
      {isProjectManager && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload Attendance PDF
            </CardTitle>
            <CardDescription>
              Upload attendance records as a PDF file for admin review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdf-upload">Select PDF File</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="flex-1"
                  />
                  <Button
                    onClick={uploadPdf}
                    disabled={!selectedFile || uploading}
                    className="min-w-[120px]"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {selectedFile && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-blue-900">{selectedFile.name}</div>
                    <div className="text-xs text-blue-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  {uploadProgress === 100 && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please ensure the PDF contains attendance data in a readable format.
                  The system will automatically process and extract attendance records.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download Section for Admin */}
      {isAdmin && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-emerald-600" />
            Uploaded PDF Files
          </CardTitle>
          <CardDescription>
            Attendance PDF files uploaded by project managers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading PDF files...</p>
            </div>
          ) : pdfFiles.length === 0 ? (
            <div className="text-center py-8">
              <Download className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No PDF Files</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No attendance PDF files have been uploaded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pdfFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{file.filename}</h4>
                    <p className="text-sm text-muted-foreground">
                      Uploaded: {new Date(file.uploadDate).toLocaleString()} •
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    onClick={() => downloadPdf(file.filename)}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Live Attendance Section */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Live Attendance Dashboard
          </CardTitle>
          <CardDescription>
            Real-time attendance records from face recognition system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading attendance records...</p>
            </div>
          ) : attendanceError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{attendanceError}</AlertDescription>
            </Alert>
          ) : attendances.length === 0 ? (
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
                        index < attendances.length - previousCount ? 'bg-yellow-100' : ''
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
