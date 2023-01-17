import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Route, Navigate } from "react-router-dom";

export const PrivateRoute = (props) => {
  return <div>PrivateRoute</div>;
};

PrivateRoute.propTypes = {
  second: PropTypes.third,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
