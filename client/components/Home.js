import React from 'react';
import { connect } from 'react-redux';
import style from './Home.module.css';

/**
 * COMPONENT
 */
export const Home = (props) => {
  return (
    <div>
      <h3>hello</h3>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(Home);
