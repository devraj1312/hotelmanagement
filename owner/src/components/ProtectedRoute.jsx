import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken"); // check token

  if (!token) {
    return <Navigate to="/login" replace />; // redirect to login
  }

  return children;
};

export default ProtectedRoute;
