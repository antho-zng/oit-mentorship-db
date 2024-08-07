const router = require("express").Router();
const Review = require("../db/models/Review");
const Mentee = require("../db/models/Mentee");

const { requireUserToken } = require("./middleware/auth-middleware");

// const requireUserToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (authHeader && authHeader.startsWith("Bearer ")) {
//       const token = authHeader.split(" ")[1];
//       const user = await User.findByToken(token);
//       req.user = user;
//       next();
//     }
//   } catch (error) {
//     next(error);
//   }
// };

const updateMenteeAcceptStatus = async (req, res, next) => {
  const scoreKey = {
    1: "NOT ACCEPTED",
    2: "WAITLIST",
    3: "LOW PRIORITY ACCEPT",
    4: "ACCEPTED",
    5: "STRONG ACCEPT",
  };

  try {
    const review = req.body.review;
    const score = review.reviewerScore;
    const mentee = await Mentee.findByPk(req.params.id);

    if (score !== 4) {
      mentee.acceptedStatus = scoreKey[score];
      mentee.save();
    } else if (score === 4) {
      const reviews = await Review.findAll({
        where: {
          menteeId: req.params.id,
        },
      });

      for (const rev of reviews) {
        if (rev.reviewerScore === 4 && rev.userId !== review.userId) {
          mentee.acceptedStatus = scoreKey[score];
          await mentee.save();
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

const resetMenteeAcceptStatus = async (req, res, next) => {
  const scoreKey = {
    1: "NOT ACCEPTED",
    2: "WAITLIST",
    3: "LOW PRIORITY ACCEPT",
    4: "ACCEPTED",
    5: "STRONG ACCEPT",
  };

  try {
    const mentee = await Mentee.findByPk(req.params.id);
    const reviews = await Review.findAll({
      where: {
        menteeId: req.params.id,
      },
    });

    for (const rev of reviews) {
      if (rev.reviewerScore !== 4 && rev.userId === req.body.userId) {
        mentee.acceptedStatus = "PENDING";
        mentee.save();
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

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
