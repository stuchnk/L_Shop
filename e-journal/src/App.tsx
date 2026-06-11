import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import SchedulePage from "@/pages/SchedulePage";

import UsersPage from "@/pages/admin/UsersPage";
import SubjectsPage from "@/pages/admin/SubjectsPage";
import ClassesPage from "@/pages/admin/ClassesPage";

import MyClassesPage from "@/pages/teacher/MyClassesPage";
import GradebookPage from "@/pages/teacher/GradebookPage";
import TeacherAttendancePage from "@/pages/teacher/AttendancePage";

import StudentGradesPage from "@/pages/student/GradesPage";
import StudentAttendancePage from "@/pages/student/AttendancePage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schedule" element={<SchedulePage />} />

            {/* admin */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/subjects"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <SubjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/classes"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ClassesPage />
                </ProtectedRoute>
              }
            />

            {/* teacher */}
            <Route
              path="/teacher/classes"
              element={
                <ProtectedRoute roles={["teacher"]}>
                  <MyClassesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/gradebook"
              element={
                <ProtectedRoute roles={["teacher"]}>
                  <GradebookPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/attendance"
              element={
                <ProtectedRoute roles={["teacher"]}>
                  <TeacherAttendancePage />
                </ProtectedRoute>
              }
            />

            {/* student */}
            <Route
              path="/student/grades"
              element={
                <ProtectedRoute roles={["student"]}>
                  <StudentGradesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/attendance"
              element={
                <ProtectedRoute roles={["student"]}>
                  <StudentAttendancePage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
