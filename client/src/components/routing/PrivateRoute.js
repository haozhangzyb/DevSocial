import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { Route, Navigate } from "react-router-dom";
import Spinner from "../layout/Spinner";

export const PrivateRoute = ({ component: Component }) => {
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );
  const isLoading = useSelector((state) => state.authReducer.isLoading);

  if (isLoading) return <Spinner />;
  if (isAuthenticated) return <Component />;

  return <Navigate to='/login' />;
};

export default PrivateRoute;
