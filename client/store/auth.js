import axios from "axios";
import history from "../history";

const TOKEN = "token";

/**
 * ACTION TYPES
 */
const SET_AUTH = "SET_AUTH";

/**
 * ACTION CREATORS
 */
const setAuth = (auth) => ({ type: SET_AUTH, auth });

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch) => {
  try {
    const token = window.localStorage.getItem(TOKEN);
    if (token) {
      const res = await axios.get("/auth/me", {
        headers: {
          authorization: token,
          "content-type": "application/json",
        },
      });
      return dispatch(setAuth(res.data));
    }
  } catch (authError) {
    return dispatch(setAuth({ error: authError }));
  }
};

export const authenticate = (req, method) => async (dispatch) => {
  try {
    const res = await axios.post(`/auth/${method}`, req);
    window.localStorage.setItem(TOKEN, res.data.token);
    dispatch(me());
    window.location.href = "/home";
  } catch (authError) {
    return dispatch(setAuth({ error: authError }));
  }
};

export const logout = () => {
  window.localStorage.removeItem(TOKEN);
  history.push("/login");
  return {
    type: SET_AUTH,
    auth: {},
  };
};

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case SET_AUTH:
      return action.auth;
    default:
      return state;
  }
}
