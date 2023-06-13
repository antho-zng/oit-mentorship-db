import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  withRouter,
  Route,
  Switch,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { me } from './store';
import style from './Routes.module.css';

import { Login, Signup } from './components/AuthForm';
import Home from './components/Home';
import SingleMentee from './components/SingleMentee/SingleMentee';
import AllMentees from './components/AllMentees/AllMentees';

/**
 * COMPONENT
 */

class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <div className={style.pageContent}>
        {isLoggedIn ? (
          <Switch>
            {/* <Route path='/home' component={Home} /> */}
            <Route path='/applications/:id' component={SingleMentee} />
            <Route exact path='/applications' component={AllMentees} />
          </Switch>
        ) : (
          <Switch>
            <Route path='/' exact component={Login} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
          </Switch>
        )}
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me());
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));
