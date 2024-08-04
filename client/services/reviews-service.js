import axiosInstance from "../AxiosWrapper";

const getReviews = async (menteeId) => {
  const searchParams = new URLSearchParams(`menteeId=${menteeId}`);
  try {
    const { data: reviews } = await axiosInstance.get(`/reviews`, {
      params: searchParams,
    });
    return reviews;
  } catch (error) {
    const { status } = error;
    throw new Error(`${status}: Error getting reviews`);
  }
};

const addReview = async (review) => {
  try {
    const response = await axiosInstance.post(`/reviews`, { review });
    return response;
  } catch (error) {
    const { status } = error;
    throw new Error(`${status}: Error adding review`);
  }
};

const editReview = async (review, id) => {
  console.log({ review });
  try {
    const response = await axiosInstance.put(`/reviews/${id}`, { review });
    return response;
  } catch (error) {
    const { status } = error;
    throw new Error(`${status}: Error editing review`);
  }
};

const deleteReview = async (userId, menteeId) => {
  try {
    const response = await axiosInstance.delete(`/reviews/${menteeId}`, {
      data: { userId },
    });
    return response;
  } catch (error) {
    const { status } = error;
    throw new Error(`${status}: Error deleting review`);
  }
};

export { getReviews, addReview, editReview, deleteReview };
