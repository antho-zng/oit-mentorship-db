import axios from "axios";

const getReviews = async (menteeId, token) => {
  const searchParams = `menteeId=${menteeId}`;
  const params = new URLSearchParams(searchParams);
  try {
    const { data: reviews } = await axios.get(`/api/reviews`, {
      headers: {
        authorization: token,
      },
      params,
    });
    return reviews;
  } catch (error) {
    // TODO: better error handling
    console.error(error);
    return;
  }
};

const addReview = async (review, token) => {
  try {
    const { data } = await axios.post(`/api/reviews`, {
      review,
      headers: {
        authorization: token,
        "content-type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.error(error);
    return;
  }
};

const editReview = async (review, id, token) => {
  try {
    const { data } = await axios.put(`/api/reviews/${id}`, {
      review,
      headers: {
        authorization: token,
        "content-type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

const deleteReview = async (userId, menteeId, token) => {
  try {
    const response = await axios.delete(`/api/reviews/${menteeId}`, {
      headers: {
        authorization: token,
      },
      data: { userId: userId },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export { getReviews, addReview, editReview, deleteReview };
