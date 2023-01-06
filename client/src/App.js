import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
} from "react-router-dom";

import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route exact path='/' element={<Landing />} />
      <Route path='register' element={<Register />} />
      <Route path='login' element={<Login />} />
    </Routes>
  </Router>
);

export default App;
