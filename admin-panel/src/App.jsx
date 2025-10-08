import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Hotels from './pages/Hotels';
import Clients from './pages/Clients';
import Subscriptions from './pages/Subscriptions';
import Admins from './pages/Admins';
import Tickets from './pages/Tickets';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
