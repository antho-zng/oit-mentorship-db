const Review = require("../../db/models/Review");
const Mentee = require("../../db/models/Mentee");
const { db } = require("../../db");
const { SCORE_KEY } = require("../../constants");

// For breakdown of scoring logic, see bottom of file :)
const updateMenteeAcceptStatus = async (req, res, next) => {
  const trx = await db.transaction();
  try {
    req.trx = trx;
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
        mentee.acceptedStatus = SCORE_KEY[1];
      } else if (score === 5) {
        mentee.acceptedStatus = SCORE_KEY[5];
      }
      await mentee.save({ transaction: trx });
    } else if (existingReviews.length === 1) {
      const firstReviewScore = existingReviews[0].reviewerScore;

      if (score === 1) {
        if (firstReviewScore === 5) {
          mentee.acceptedStatus = SCORE_KEY[3];
        } else {
          mentee.acceptedStatus = SCORE_KEY[1];
        }
      } else if (score === 2) {
        if (firstReviewScore === 1) {
          mentee.acceptedStatus = SCORE_KEY[1];
        } else if (firstReviewScore === 2 || firstReviewScore === 3) {
          mentee.acceptedStatus = SCORE_KEY[2];
        } else if (firstReviewScore === 4) {
          mentee.acceptedStatus = SCORE_KEY[3];
        } else if (firstReviewScore === 5) {
          mentee.acceptedStatus = SCORE_KEY[4];
        }
      } else if (score === 3) {
        if (firstReviewScore === 1) {
          mentee.acceptedStatus = SCORE_KEY[1];
        } else if (firstReviewScore === 2) {
          mentee.acceptedStatus = SCORE_KEY[2];
        } else if (firstReviewScore === 3 || firstReviewScore === 4) {
          mentee.acceptedStatus = SCORE_KEY[3];
        } else if (firstReviewScore === 5) {
          mentee.acceptedStatus = SCORE_KEY[5];
        }
      } else if (score === 4) {
        if (firstReviewScore === 1) {
          mentee.acceptedStatus = SCORE_KEY[1];
        } else if (firstReviewScore === 2 || firstReviewScore === 3) {
          mentee.acceptedStatus = SCORE_KEY[3];
        } else if (firstReviewScore === 4) {
          mentee.acceptedStatus = SCORE_KEY[4];
        } else if (firstReviewScore === 5) {
          mentee.acceptedStatus = SCORE_KEY[5];
        }
      } else if (score === 5) {
        if (firstReviewScore === 1) {
          mentee.acceptedStatus = SCORE_KEY[3];
        } else if (firstReviewScore === 2) {
          mentee.acceptedStatus = SCORE_KEY[4];
        } else if (
          firstReviewScore === 3 ||
          firstReviewScore === 4 ||
          firstReviewScore === 5
        ) {
          mentee.acceptedStatus = SCORE_KEY[5];
        }
      }
      await mentee.save({ transaction: trx });
    }

    next();
  } catch (error) {
    await trx.rollback();
    next(error);
  }
};

const resetMenteeAcceptStatus = async (req, res, next) => {
  const trx = await db.transaction();
  try {
    req.trx = trx;
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
        mentee.acceptedStatus = SCORE_KEY[1];
      } else if (otherReviews[0].reviewerScore === 5) {
        mentee.acceptedStatus = SCORE_KEY[5];
      } else {
        mentee.acceptedStatus = "PENDING";
      }
      await mentee.save({ transaction: trx });
    } else {
      mentee.acceptedStatus = "PENDING";
      await mentee.save({ transaction: trx });
    }
    next();
  } catch (error) {
    await trx.rollback();
    next(error);
  }
};

module.exports = { updateMenteeAcceptStatus, resetMenteeAcceptStatus };

/**
 * SCORING KEY:
 *
 * FIRST SCORE IN:
 * 1 -> Not Accepted
 * 2 -> No status update
 * 3 -> No status update
 * 4 -> No status update
 * 5 -> Strong Accept
 *
 * SECOND SCORE IN:
 * 1 ->
 * If first score is 5 -> Low-Priority Accept
 * Otherwise -> Not Accepted
 * 2 ->
 * If first score is 1 -> Not Accepted
 * If first score is 2 or 3 -> Waitlist
 * If first score is 4 -> Low-Priority Accept
 * If first score is 5 -> Accepted
 * 3 ->
 * If first score is 1 -> Not Accepted
 * If first score is 2 -> Waitlist
 * If first score is 3 or 4 -> Low-Priority Accept
 * If first score is 5 -> Strong Accept
 * 4 ->
 * If first score is 1 -> Not Accepted
 * If first score is 2 or 3 -> Low-Priority Accept
 * If first score is 4 -> Accept
 * If first score is 5 -> Strong Accept
 * 5 ->
 * If first score is 1 -> Low-Priority Accept
 * If first score is 2 -> Accept
 * If first score is 3, 4, or 5 -> Strong Accept
 */
