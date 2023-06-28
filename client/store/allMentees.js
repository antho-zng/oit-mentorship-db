import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
const GET_ALL_MENTEES = 'GET_ALL_MENTEES';

/**
 * ACTION CREATORS
 */
const _getAllMentees = (mentees) => ({ type: GET_ALL_MENTEES, mentees });

/**
 * THUNK CREATORS
 */

export const getAllMentees = (searchParams, token) => async (dispatch) => {
  const params = new URLSearchParams(searchParams);

  try {
    const { data } = await axios.get(`/api/mentees`, {
      headers: {
        authorization: token,
      },
      params,
    });
    dispatch(_getAllMentees(data));
  } catch (error) {
    console.log('Mentees not found!');
    throw error;
  }
};

// INITIAL STATE
const initialState = [];

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ALL_MENTEES:
      return action.mentees;
    default:
      return state;
  }
}
