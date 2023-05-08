import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../store';
import style from './Navbar.module.css';
import cornerLogo from './OIT-Logo-Black-1.png';

const Navbar = ({ handleClick, isLoggedIn }) => (
  <div>
    <nav>
      {isLoggedIn ? (
        <div>
          {/* The navbar will show these links after you log in */}
          <Link to='/home'>HOME</Link>
          <Link to='/applications'>APPLICATIONS</Link>
          <Link to='/interviews'>INTERVIEWS</Link>
          <Link to='/matching'>MATCHING</Link>

          <a href='#' onClick={handleClick}>
            LOGOUT
          </a>
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link to='/login'>LOGIN</Link>
          <Link to='/signup'>SIGN UP</Link>
        </div>
      )}
    </nav>
  </div>
);

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);
