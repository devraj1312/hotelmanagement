import { Routes, Route, Navigate } from "react-router-dom";
import OwnerLayout from "./layouts/OwnerLayout";
import Dashboard from "./pages/Dashboard";
import Finance from "./pages/Finance";
import Booking from "./pages/Booking";
import Staff from "./pages/Staff";
import Maintenance from "./pages/Maintenance";
import Review from "./pages/Review";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

import "./styles/styles.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/review" element={<Review />} />
          {/* Agar wrong URL ho to dashboard redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
