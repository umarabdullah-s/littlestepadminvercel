import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./sections/Login/Login";
import Dashboard from "./sections/Dashboard/Dashboard";
import Request from "./sections/Request/Request";
import Staff from "./sections/Staff/Staff";
import Announcement from "./sections/Announcement/Announcement";
import ProtectedRoute from "./components/layouts/ProtectedRoute";
import StaffDetails from "./sections/StaffDetails/StaffDetails";
import CreateStaff from "./sections/createStaff/CreateStaff";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request"
          element={
            <ProtectedRoute>
              <Request />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <Staff />
            </ProtectedRoute>
          }
        />
      
        <Route
          path="/announcement"
          element={
            <ProtectedRoute>
              <Announcement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/:id"
          element={
            <ProtectedRoute>
              <StaffDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/create-staff"
          element={
            <ProtectedRoute>
              <CreateStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/edit/:id"
          element={
            <ProtectedRoute>
              <CreateStaff />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;