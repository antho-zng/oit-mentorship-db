import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_ALL_COHORTS = 'GET_ALL_COHORTS';

/**
 * ACTION CREATORS
 */
const _getAllCohorts = (cohorts) => ({ type: GET_ALL_COHORTS, cohorts });

/**
 * THUNK CREATORS
 */

export function getAllCohorts() {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.get(`/api/cohorts`);
      dispatch(_getAllCohorts(data));
    } catch (error) {
      console.log('Cohorts not found!');
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
    case GET_ALL_COHORTS:
      return [...action.cohorts];
    default:
      return state;
  }
}
