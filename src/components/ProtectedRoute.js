import {Navigate} from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...props }) => {
  return props.isLoggedIn ? <Component {...props} /> : <Navigate to="/signin" />;
}

export default ProtectedRoute;
