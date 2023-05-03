import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
const GET_MENTEE = 'GET_MENTEE';
const GET_ALL_MENTEES = 'GET_ALL_MENTEES';

/**
 * ACTION CREATORS
 */
const _getMentee = (mentee) => ({ type: GET_MENTEE, mentee });
const _getAllMentees = (mentees) => ({ type: GET_ALL_MENTEES, mentees });

/**
 * THUNK CREATORS
 */

export const getMentee = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/mentees/${id}`);
      dispatch(_getMentee(data));
    } catch (error) {
      console.log('Mentee not found!');
      throw error;
    }
  };
};

export function getAllMentees() {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/mentees`);
      dispatch(_getAllMentees(data));
    } catch (error) {
      console.log('Mentees not found!');
      throw error;
    }
  };
}

// INITIAL STATE
const initialState = {};

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_MENTEE:
      return action.mentee;
    case GET_ALL_MENTEES:
      return action.mentees;
    default:
      return state;
  }
}
