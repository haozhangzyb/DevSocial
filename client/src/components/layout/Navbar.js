import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logout } from "../../actions/auth";

const Navbar = () => {
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );

  const dispatch = useDispatch();

  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Profiles</Link>
      </li>
      <li>
        <a onClick={() => logout()(dispatch)} href='/'>
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
        <Link to='/'>
          <i className='fas fa-code'></i> DevSocial
        </Link>
      </h1>
      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;
