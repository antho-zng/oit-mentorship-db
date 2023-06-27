import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
const GET_REVIEWS = 'GET_REVIEWS';
const ADD_REVIEW = 'ADD_REVIEW';
const EDIT_REVIEW = 'EDIT_REVIEW';
const DELETE_REVIEW = 'DELETE_REVIEW';

/**
 * ACTION CREATORS
 */
const _getReviews = (reviews) => ({ type: GET_REVIEWS, reviews });
const _addReview = (review) => {
  return {
    type: ADD_REVIEW,
    review,
  };
};
const _editReview = (review) => ({ type: EDIT_REVIEW, review });
const _deleteReview = (userId) => ({ type: DELETE_REVIEW, userId });

/**
 * THUNK CREATORS
 */

export const getReviews = (searchParams, token) => async (dispatch) => {
  const params = new URLSearchParams(searchParams);

  try {
    const { data } = await axios.get(`/api/reviews`, {
      headers: {
        authorization: token,
      },
      params,
    });
    return dispatch(_getReviews(data));
  } catch (error) {
    console.error(error);
  }
};

export function addReview(review, token) {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.post(`/api/reviews`, {
        review,
        headers: {
          authorization: token,
          'content-type': 'application/json',
        },
      });
      dispatch(_addReview(data));
    } catch (error) {
      console.error(error);
      return;
    }
  };
}

export function editReview(review, id, token) {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.put(`/api/reviews/${id}`, {
        review,
        headers: {
          authorization: token,
          'content-type': 'application/json',
        },
      });
      dispatch(_editReview(data));
    } catch (error) {
      console.error(error);
    }
  };
}

export function deleteReview(userId, menteeId, token) {
  return async (dispatch, getState) => {
    const response = await axios.delete(`/api/reviews/${menteeId}`, {
      headers: {
        authorization: token,
      },
      data: { userId: userId },
    });
    return dispatch(_deleteReview(userId));
  };
}

const initialState = {};

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_REVIEW:
      return [...state, ...action.review];
    case GET_REVIEWS:
      return action.reviews;
    case EDIT_REVIEW:
      return state.map((review) => {
        if (review.id === action.review.id) {
          review = action.review;
          return review;
        } else {
          return;
        }
      });
    case DELETE_REVIEW:
      return state.filter((review) => review.userId !== action.userId);
    default:
      return state;
  }
}

// return state.filter((review) => review.userId !== action.review.userId);

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

// export const getReviews = (id) => {
//   return async (dispatch) => {
//     try {
//       const { data } = await axios.get(`/api/reviews/${id}`);
//       dispatch(_getReviews(data));
//     } catch (error) {
//       console.log('Reviews not found!');
//       throw error;
//     }
//   };
// };
