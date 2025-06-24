/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import authChecker from '../utils/AuthHelper';

// ----------------------------------------------------------------------

function AuthProtect({ children }) {
  const auth = authChecker('authCheck');
  if (auth) {
    return <Navigate to={children} />;
  }
  return <Navigate to="/login" />;
}
AuthProtect.propTypes = {
  children: PropTypes.string
};

export default AuthProtect;
