import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { logout } from "../../actions/auth";

const Navbar = ({ isAuthenticated, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Profiles</Link>
      </li>
      <li>
        <a onClick={logout} href='#!'>
          <i className='fas fa-sign-out-alt' />{" "}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Profiles</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <a href='index.html'>
          <i className='fas fa-code'></i> DevSocial
        </a>
      </h1>
      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  logout: PropTypes.func.isRequired,
});

Navbar.prototypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, { logout })(Navbar);
