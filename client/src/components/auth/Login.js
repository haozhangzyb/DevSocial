import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { login as loginAction } from "../../actions/auth";

const Login = ({ loginAction, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    // console.log("success");
    loginAction(email, password);
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }

  return (
    <section className='container'>
      <h1 className='large text-primary'>Login</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={submitForm}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            required
            value={email}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            required
            value={password}
            onChange={onChange}
          />
        </div>

        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Register</Link>
      </p>
    </section>
  );
};

Login.prototypes = {
  loginAction: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(mapStateToProps, { loginAction })(Login);
