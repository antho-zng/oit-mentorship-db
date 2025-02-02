import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import {
  withRouter,
  Route,
  Switch,
  Redirect,
  useLocation,
} from "react-router-dom";
import { me } from "./store";
import style from "./Routes.module.css";

import { Login, Signup } from "./components/AuthForm/AuthForm";
import SingleMentee from "./components/SingleMentee/SingleMentee";
import AllMentees from "./components/AllMentees/AllMentees";
import UserProfile from "./components/UserProfile/UserProfile";

/**
 * COMPONENT
 */

function Routes(props) {
  useEffect(() => {
    props.loadInitialData();
  }, []);

  const isLoggedIn = useSelector((state) => state.auth.id || null);

  return (
    <div className={style.pageContent}>
      {isLoggedIn ? (
        <Switch>
          <Route
            path="/home"
            render={(props) => <UserProfile userId={isLoggedIn} />}
          />
          <Route path="/applications/:id" component={SingleMentee} />
          <Route exact path="/applications" component={AllMentees} />
          <Route
            exact
            path="/"
            render={(props) => <UserProfile userId={isLoggedIn} />}
          />
        </Switch>
      ) : (
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </Switch>
      )}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadInitialData: () => {
      dispatch(me());
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(null, mapDispatchToProps)(Routes));
