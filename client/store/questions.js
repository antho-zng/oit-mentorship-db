import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
const GET_QUESTION = 'GET_QUESTION';

/**
 * ACTION CREATORS
 */
const _getQuestions = (questions) => ({ type: GET_QUESTION, questions });

/**
 * THUNK CREATORS
 */

export const getQuestions = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/questions`);
      dispatch(_getQuestions(data));
    } catch (error) {
      console.log('Questions not found!');
      throw error;
    }
  };
};

// INITIAL STATE
const initialState = {};

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_QUESTION:
      return action.questions;
    default:
      return state;
  }
}
