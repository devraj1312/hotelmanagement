import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken'); // check if logged in

  if (!accessToken) {
    return <Navigate to="/" replace />; // redirect to login if no token
  }

  return children;
};

export default ProtectedRoute;
