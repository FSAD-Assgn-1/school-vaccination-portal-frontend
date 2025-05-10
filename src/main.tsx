import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import "./index.css";
import Dashboard from "./pages/Home.tsx";
import Reports from "./pages/Reports.tsx";
import SignIn from "./pages/Signin.tsx";
import StudentManagement from "./pages/StudentPage.tsx";
import VaccinationDriveManagement from "./pages/VaccinationDrivePage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer />
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vaccination-drive"
          element={
            <ProtectedRoute>
              <VaccinationDriveManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<>Not found</>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
