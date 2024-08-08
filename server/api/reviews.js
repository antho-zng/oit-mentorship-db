const router = require("express").Router();
const Review = require("../db/models/Review");
const Mentee = require("../db/models/Mentee");
const {
  updateMenteeAcceptStatus,
  resetMenteeAcceptStatus,
} = require("./middleware/reviews-middleware");
const { requireUserToken } = require("./middleware/auth-middleware");

// GET /api/reviews
router.get("/", requireUserToken, async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: req.query,
      include: [Mentee],
    });
    res.send(reviews);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET /api/reviews/:id
router.get("/:id", async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: {
        menteeId: req.params.id,
      },
    });
    res.send(reviews);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST (creating new review)
router.post("/", requireUserToken, async (req, res, next) => {
  try {
    const review = await Review.create(req.body.review);
    res.send(review);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// PUT (editing review)
router.put(
  "/:id",
  requireUserToken,
  updateMenteeAcceptStatus,
  async (req, res, next) => {
    try {
      const review = await Review.findOne({
        where: {
          menteeId: req.params.id,
          userId: req.body.review.userId,
        },
      });
      review.reviewerComments = req.body.review.reviewerComments;
      review.reviewerScore = req.body.review.reviewerScore;
      review.submitStatus = req.body.review.submitStatus;

      review.save();
      res.send(review);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// DELETE
router.delete(
  "/:id",
  requireUserToken,
  resetMenteeAcceptStatus,
  async (req, res, next) => {
    try {
      const review = await Review.findOne({
        where: {
          menteeId: req.params.id,
          userId: req.body.userId,
        },
      });
      await review?.destroy();
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

module.exports = router;
