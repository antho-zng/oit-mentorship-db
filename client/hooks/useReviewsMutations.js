import {
  addReview,
  editReview,
  deleteReview,
} from "../services/reviews-service";
import { useMutation } from "@tanstack/react-query";

const addReviewMutation = () => {
  return useMutation({
    mutationFn: (review) => {
      return addReview(review);
    },
  });
};

const editReviewMutation = () => {
  return useMutation({
    mutationFn: ({ review, menteeId }) => {
      return editReview(review, menteeId);
    },
  });
};

const deleteReviewMutation = () => {
  return useMutation({
    mutationFn: ({ userId, menteeId }) => {
      return deleteReview(userId, menteeId);
    },
  });
};

export { addReviewMutation, editReviewMutation, deleteReviewMutation };
