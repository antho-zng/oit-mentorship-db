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
      console.log("delete hit!");
      return deleteReview(userId, menteeId);
    },
  });
};

export { addReviewMutation, editReviewMutation, deleteReviewMutation };

// const _addReviewMutation = useMutation({
//   mutationFn: (review) => {
//     return addReview(review);
//   },
//   onSuccess: async () => {
//     setReviewStatus((prev) => ({
//       ...prev,
//       reviewerAdded: true,
//       reviewDisabled: false,
//       editingMode: true,
//     }));
//     setSnackbarState((prev) => ({
//       ...prev,
//       open: true,
//       alertSeverity: "success",
//       alertMessage: "You've been added as a reviewer for this application.",
//     }));
//     setExpanded(true);
//     setReviewAccordionMessage(
//       "You have been added as a reviewer for this mentee application. Please leave your comments and score below." //TODO: move to constants
//     );
//     queryClient.invalidateQueries({ queryKey: ["reviews", menteeId] });
//   },
//   onError: async (error) => {
//     setSnackbarState({
//       open: true,
//       alertSeverity: "error",
//       alertMessage:
//         "Unable to add you as a reviewer. Please refresh and try again!",
//     });
//   },
// });
