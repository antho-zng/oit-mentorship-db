import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
const GET_MENTEE = 'GET_MENTEE';

/**
 * ACTION CREATORS
 */
const _getMentee = (mentee) => ({ type: GET_MENTEE, mentee });

/**
 * THUNK CREATORS
 */

export const getMentee = (id) => {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.get(`/api/mentees/${id}`);
      dispatch(_getMentee(data));
    } catch (error) {
      console.log('Mentee not found!');
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
    case GET_MENTEE:
      return action.mentee;
    default:
      return state;
  }
}
