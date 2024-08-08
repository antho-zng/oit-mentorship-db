const Review = require("../../db/models/Review");
const Mentee = require("../../db/models/Mentee");

const scoreKey = {
  1: "NOT ACCEPTED",
  2: "WAITLIST",
  3: "LOW PRIORITY ACCEPT",
  4: "ACCEPTED",
  5: "STRONG ACCEPT",
};

const updateMenteeAcceptStatus = async (req, res, next) => {
  try {
    const review = req.body.review;
    const score = review.reviewerScore;
    const mentee = await Mentee.findByPk(req.params.id);

    const existingReviews = await Review.findAll({
      where: {
        menteeId: req.params.id,
        submitStatus: true,
      },
    });

    if (existingReviews.length === 0) {
      if (score === 1) {
        mentee.acceptedStatus = scoreKey[1];
      } else if (score === 5) {
        mentee.acceptedStatus = scoreKey[5];
      }
      await mentee.save();
      await mentee.save();
    } else if (existingReviews.length === 1) {
      const firstReviewScore = existingReviews[0].reviewerScore;

      if (score === 1) {
        if (firstReviewScore === 5) {
          mentee.acceptedStatus = scoreKey[3];
        } else {
          mentee.acceptedStatus = scoreKey[1];
        }
      } else if (score === 2) {
        if (firstReviewScore === 1) {
          mentee.acceptedStatus = scoreKey[1];
        } else if (firstReviewScore === 2 || firstReviewScore === 3) {
          mentee.acceptedStatus = scoreKey[2];
        } else if (firstReviewScore === 4) {
          mentee.acceptedStatus = scoreKey[3];
        } else if (firstReviewScore === 5) {
          mentee.acceptedStatus = scoreKey[4];
        }
      } else if (score === 3) {
        if (firstReviewScore === 1) {
          mentee.acceptedStatus = scoreKey[1];
        } else if (firstReviewScore === 2) {
          mentee.acceptedStatus = scoreKey[2];
        } else if (firstReviewScore === 3 || firstReviewScore === 4) {
          mentee.acceptedStatus = scoreKey[3];
        } else if (firstReviewScore === 5) {
          mentee.acceptedStatus = scoreKey[5];
        }
      } else if (score === 4) {
        if (firstReviewScore === 1) {
          mentee.acceptedStatus = scoreKey[1];
        } else if (firstReviewScore === 2 || firstReviewScore === 3) {
          mentee.acceptedStatus = scoreKey[3];
        } else if (firstReviewScore === 4) {
          mentee.acceptedStatus = scoreKey[4];
        } else if (firstReviewScore === 5) {
          mentee.acceptedStatus = scoreKey[5];
        }
      } else if (score === 5) {
        if (firstReviewScore === 1) {
          mentee.acceptedStatus = scoreKey[3];
        } else if (firstReviewScore === 2) {
          mentee.acceptedStatus = scoreKey[4];
        } else if (
          firstReviewScore === 3 ||
          firstReviewScore === 4 ||
          firstReviewScore === 5
        ) {
          mentee.acceptedStatus = scoreKey[5];
        }
      }
      await mentee.save();
    }

    next();
  } catch (error) {
    next(error);
  }
};

const resetMenteeAcceptStatus = async (req, res, next) => {
  try {
    const mentee = await Mentee.findByPk(req.params.id);
    const reviews = await Review.findAll({
      where: {
        menteeId: req.params.id,
        submitStatus: true,
      },
    });

    const otherReviews = reviews.filter(
      (review) => review.userId !== req.body.userId
    );

    if (otherReviews.length > 0) {
      if (otherReviews[0].reviewerScore === 1) {
        console.log("ping 1");

        mentee.acceptedStatus = scoreKey[1];
        mentee.save();
      } else if (otherReviews[0].reviewerScore === 5) {
        console.log("ping 5");
        mentee.acceptedStatus = scoreKey[5];
        mentee.save();
      } else {
        console.log("ping 3");

        mentee.acceptedStatus = "PENDING";
        mentee.save();
      }
    } else {
      mentee.acceptedStatus = "PENDING";
      mentee.save();
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { updateMenteeAcceptStatus, resetMenteeAcceptStatus };
