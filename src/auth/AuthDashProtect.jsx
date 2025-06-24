/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import authChecker from '../utils/AuthHelper';

// ----------------------------------------------------------------------

function AuthDashProtect({ children }) {

  const auth = authChecker('dashCheck');

  if (auth) {
    return <Navigate to={children} />;
  }
  return <Navigate to="/dashboard" />;
}
AuthProtect.propTypes = {
  children: PropTypes.string
};

export default AuthDashProtect;
