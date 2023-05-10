import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
const GET_REVIEW = 'GET_REVIEW';
const ADD_REVIEW = 'ADD_REVIEW';
const EDIT_REVIEW = 'EDIT_REVIEW';

/**
 * ACTION CREATORS
 */
const _getReview = (reviews) => ({ type: GET_REVIEW, reviews });
const _addReview = (review) => ({ type: ADD_REVIEW, review });
const _editReview = (review) => ({ type: EDIT_REVIEW, review });

/**
 * THUNK CREATORS
 */

// export const getReview = (id) => {
//   return async (dispatch) => {
//     try {
//       const { data } = await axios.get(`/api/:id`);
//       dispatch(_getQuestions(data));
//     } catch (error) {
//       console.log('Questions not found!');
//       throw error;
//     }
//   };
// };

export const addReview = async (review, token) => {
  try {
    const { data } = await axios.post(`/api/reviews`, {
      review,
      headers: {
        authorization: token,
        'content-type': 'application/json',
      },
    });
    return dispatch(_addReview(data));
  } catch (error) {
    console.log(error);
  }
};

//   return async (dispatch) => {
//     try {
//       console.log(`review thunk working here pt2`); // ERROR : this should log
//       console.log(`review thunk working here pt2.5`); // ERROR : this should log

//       const { data } = await axios.post(`/api/reviews`, {
//         review,
//         headers: {
//           authorization: token,
//           'content-type': 'application/json',
//         },
//       });
//       console.log(`review thunk working pt3`);
//       return dispatch(_addReview(data));
//     } catch (error) {
//       console.log(error);
//     }
//   };
// };

// INITIAL STATE
const initialState = {};

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_REVIEW:
      return action.review;
    default:
      return state;
  }
}

// export const addReview = (review) => {
//   console.log(`review thunk working here`); // this is logging
//   console.log(review); // this is all showing up
//   return async (dispatch) => {
//     console.log(`review thunk working here pt2`); // ERROR : this should log
//     try {
//       console.log(`review thunk working here pt2.5`); // ERROR : this should log

//       const res = await axios.post('/api/reviews', {
//         review,
//       });
//       console.log(`review thunk working pt3`);
//       return dispatch(_addReview(res.data));
//     } catch (error) {
//       console.log('error with review thunk :(');
//       console.log(error);
//     }
//   };
// };
