import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../store';
import style from './Navbar.module.css';
import cornerLogo from './OIT-Logo-Black.png';

function Navbar({ handleClick }) {
  const isLoggedIn = useSelector((state) => state.auth.id || null);

  return (
    <div className={style.container}>
      <nav>
        <div className={style.logoContainer}>
          <img className={style.logo} src={cornerLogo} alt='Out-in-Tech logo' />
        </div>
        {isLoggedIn ? (
          <div className={style.navbarLinks}>
            <Link to='/home' title='HOME'>
              HOME
            </Link>
            <Link to='/applications' title='APPLICATIONS'>
              APPLICATIONS
            </Link>

            <a href='#' onClick={handleClick} title='LOGOUT'>
              LOGOUT
            </a>
          </div>
        ) : (
          <div className={style.navbarLinks}>
            <Link to='/login' title='LOGIN'>
              LOGIN
            </Link>
            <Link to='/signup' title='SIGN UP'>
              SIGN UP
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(null, mapDispatch)(Navbar);
