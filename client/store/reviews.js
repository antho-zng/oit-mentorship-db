import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
const GET_REVIEWS = 'GET_REVIEWS';
const ADD_REVIEW = 'ADD_REVIEW';
const EDIT_REVIEW = 'EDIT_REVIEW';

/**
 * ACTION CREATORS
 */
const _getReviews = (reviews) => ({ type: GET_REVIEWS, reviews });
const _addReview = (review) => ({ type: ADD_REVIEW, review });
const _editReview = (review) => ({ type: EDIT_REVIEW, review });

/**
 * THUNK CREATORS
 */

export const getReviews = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/reviews/${id}`);
      dispatch(_getReviews(data));
    } catch (error) {
      console.log('Reviews not found!');
      throw error;
    }
  };
};

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

export const editReview = async (review, id, token) => {
  try {
    const { data } = await axios.put(`/api/reviews/${id}`, {
      review,
      headers: {
        authorization: token,
        'content-type': 'application/json',
      },
    });
    return dispatch(_editReview(data));
  } catch (error) {
    console.error(error);
  }
};

// export const editItemQuant = (token, itemId, cartId, quant) => {
//   return async (dispatch) => {
//     try {
//       const response = await axios('/api/orders/cart', {
//         headers: { authorization: token },
//         data: { itemId: itemId, cartId: cartId, quantity: +quant },
//         method: 'put',
//       });
//       const editedItem = response.data;
//       dispatch(editQuant(editedItem));
//     } catch (e) {
//       console.error(e);
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
    case GET_REVIEWS:
      return action.reviews;
    case EDIT_REVIEW:
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
