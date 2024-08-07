// AlertSnackbar.js

export const REVIEWS_MUTATION_SNACKBAR_MESSAGES = {
  REVIEWER_ADD_SUCCESS: "You've been added as a reviewer for this application.",
  REVIEWER_ADD_ERROR:
    "Unable to add you as a reviewer. Please refresh and try again.",
  REVIEW_SUBMIT_SUCCESS: "Thank you for submitting your review!",
  REVIEW_SUBMIT_ERROR: "Unable to submit review. Please refresh and try again.",
  REVIEW_DELETE_SUCCESS: "Your review has been successfully deleted.",
  REVIEW_DELETE_ERROR:
    "Unable to delete your review. Please refresh and try again.",
};

export const FETCHING_SNACKBAR_MESSAGES = {
  MENTEE_FETCH_ERROR:
    "Unable to fetch mentee data. Please refresh the page and try again.",
  REVIEWS_FETCH_ERROR:
    "Unable to fetch reviews. Please refresh the page and try again.",
};

// SingleMentee.js
export const QUESTION_CUTOFF = 8;
export const GENERAL_INFO_QUESTIONS_CUTOFF = 15;
export const ESSAY_RESPONSE_CUTOFF = 29;
export const SCORE_LABELS = {
  1: "Reject",
  2: "Waitlist",
  3: "Interview (Low Priority)",
  4: "Interview",
  5: "Questionnaire (Strong Accept)",
};
export const REVIEW_ACCORDION_MESSAGES = {
  ADDED_AS_REVIEWER:
    "You have been added as a reviewer for this mentee application. Please leave your comments and score below.",
  ALREADY_REVIEWED: "This application has already been reviewed.",
  NO_FURTHER_REVIEWS_NEEDED:
    "This application has already been reviewed. No further reviews are needed.",
  ADD_YOURSELF_AS_REVIEWER:
    "Add yourself as a reviewer to leave score and comments for this application.",
  REVIEW_SUBMITTED:
    "Thank you for submitting your review for this application.",
};

// AllMentees.js
export const REVIEW_DEADLINE = "SEPT 23, 2024";

/**
 *   
  REVIEW_DELETED: "Your review has been successfully deleted.",
  REVIEW_SUBMISSION_ERROR:
    "Unable to submit review. Please refresh and try again.",
  REVIEW_ADD_ERROR:
    "Unable to add you as a reviewer. Please refresh and try again.",
  REVIEW_DELETE_ERROR:
    "Unable to delete your review. Please refresh and try again.",
  MENTEE_DATA_ERROR:
    "Unable to fetch mentee data. Please refresh the page and try again.",
  REVIEWS_ERROR:
    "Unable to fetch reviews. Please refresh the page and try again.",
 */
