import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import auth from './auth';
import mentee from './mentee';
import allMentees from './allMentees';
import questions from './questions';
import reviews from './reviews';

const reducer = combineReducers({
  auth,
  mentee,
  allMentees,
  questions,
  reviews,
});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from './auth';
