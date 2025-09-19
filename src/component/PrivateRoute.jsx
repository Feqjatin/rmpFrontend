import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
    const roles = useSelector((state) => state.user.roles);
    console.log(roles);
    
    const isAuthorized = roles.some(r => allowedRoles.includes(r));
  
    return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" replace />;
  };
  export default PrivateRoute;