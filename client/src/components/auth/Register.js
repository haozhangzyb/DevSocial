import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setAlert } from "../../actions/alert";
import { register as registerAction } from "../../actions/auth";

const Register = () => {
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("password do not match", "danger", 3000)(dispatch);
    } else {
      // console.log("success");
      registerAction({ name, email, password })(dispatch);
    }
  };

  // Redirect if registered
  if (isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }

  return (
    <section className='container'>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={submitForm}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            required
            value={name}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            required
            value={email}
            onChange={onChange}
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
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
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            required
            value={password2}
            onChange={onChange}
          />
        </div>
        <input
          type='submit'
          className='btn btn-primary'
          value='Register'
        />
      </form>
      <p className='my-1'>
        Already have an account?
        <Link to='/login'>Log In</Link>
      </p>
    </section>
  );
};

export default Register;
