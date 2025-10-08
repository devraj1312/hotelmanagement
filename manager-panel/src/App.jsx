import { Routes, Route, Navigate } from "react-router-dom";
import ManagerLayout from "./layouts/ManagerLayout";

// Pages
import Dashboard from "./pages/Manager/Dashboard";
import RoomList from "./pages/Rooms/RoomList";
import AddRoom from "./pages/Rooms/AddRoom";
import EditRoom from "./pages/Rooms/EditRoom";
import StaffList from "./pages/Staff/StaffList";
import AddStaff from "./pages/Staff/AddStaff";
import EditStaff from "./pages/Staff/EditStaff";
import BookingList from "./pages/Bookings/BookingList";
import BookRoom from "./pages/Bookings/BookRoom";
import MaintenanceList from "./pages/Maintenance/MaintenanceList";
import TicketList from "./pages/Tickets/TicketList";
import ExpenseList from "./pages/Expenses/ExpenseList";
import AddExpense from "./pages/Expenses/AddExpense";
import HotelProfile from "./pages/Settings/HotelProfile";

import Login from "./pages/ManagerLogin";
// import Register from "./pages/Register";
// import ProtectedRoute from "./components/ProtectedRoute";

import "./styles/styles.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Protected routes */}
        {/* <Route
          element={
            <ProtectedRoute>
              <ManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/manager/dashboard" element={<Dashboard />} />
          <Route path="/manager/rooms" element={<RoomList />} />
          <Route path="/manager/rooms/add" element={<AddRoom />} />
          <Route path="/manager/rooms/edit/:id" element={<EditRoom />} />
          
          <Route path="/manager/staff" element={<StaffList />} />
          <Route path="/manager/staff/add" element={<AddStaff />} />
          <Route path="/manager/staff/edit/:id" element={<EditStaff />} />

          <Route path="/manager/bookings" element={<BookingList />} />
          <Route path="/manager/book-room" element={<BookRoom />} />

          <Route path="/manager/maintenance" element={<MaintenanceList />} />
          <Route path="/manager/tickets" element={<TicketList />} />

          <Route path="/manager/expenses" element={<ExpenseList />} />
          <Route path="/manager/expenses/add" element={<AddExpense />} />

          <Route path="/manager/settings" element={<HotelProfile />} />

          <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
        </Route> */}
      
        <Route
          element={
              <ManagerLayout />
          }
        >
          <Route path="/manager/dashboard" element={<Dashboard />} />
          <Route path="/manager/rooms" element={<RoomList />} />
          <Route path="/manager/rooms/add" element={<AddRoom />} />
          <Route path="/manager/rooms/edit/:id" element={<EditRoom />} />
          
          <Route path="/manager/staff" element={<StaffList />} />
          <Route path="/manager/staff/add" element={<AddStaff />} />
          <Route path="/manager/staff/edit/:id" element={<EditStaff />} />

          <Route path="/manager/bookings" element={<BookingList />} />
          <Route path="/manager/book-room" element={<BookRoom />} />

          <Route path="/manager/maintenance" element={<MaintenanceList />} />
          <Route path="/manager/tickets" element={<TicketList />} />

          <Route path="/manager/expenses" element={<ExpenseList />} />
          <Route path="/manager/expenses/add" element={<AddExpense />} />

          <Route path="/manager/settings" element={<HotelProfile />} />

          <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
        </Route>

      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
