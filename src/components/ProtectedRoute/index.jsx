import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('jwt_token')
  // Check if the token exists
  // If it does not exist, redirect to the login page
  

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
