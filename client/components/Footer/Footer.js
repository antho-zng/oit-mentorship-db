import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../store';
import style from './Footer.module.css';
import logo from './OiT_logo.png';

function Footer() {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.logoContainer}>
          <img className={style.logo} src={logo} alt='Out-in-Tech logo' />
        </div>
        <div className={style.links}>
          <p className={style.aboutHeader}>ABOUT</p>
          <a href='https://outintech.com/u/'>Out-in-Tech U</a>
          <a href='https://outintech.com/mentorship-program/'>
            Mentorship Program
          </a>
        </div>
      </div>
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

export default connect(null, mapDispatch)(Footer);
