import React from 'react';
import { Redirect} from "react-router-dom";

const ProtectedRoute = ({component: Component, ...props}) => {
  // return props.isLogged ? <Component {...props} /> :<Redirect to="./signin" />
  return props.isLogged && <Redirect to='./signin' />
}

export default ProtectedRoute;
