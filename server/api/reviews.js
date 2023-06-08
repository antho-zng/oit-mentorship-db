const Sequelize = require('sequelize');
const router = require('express').Router();
const Review = require('../db/models/Review');
const User = require('../db/models/User');

const requireUserToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.body.headers.authorization;
    const user = await User.findByToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/:id
router.get('/:id', async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: {
        menteeId: req.params.id,
      },
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

// POST (creating new review)
router.post('/', requireUserToken, async (req, res, next) => {
  try {
    const review = await Review.create(req.body.review);
    res.send(review);
  } catch (error) {
    console.log(`Error with review API post req! Error: ${error}`);
  }
});

// PUT (editing review)
router.put('/:id', requireUserToken, async (req, res, next) => {
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
    next(error);
  }
});

// DELETE
router.delete('/:id', requireUserToken, async (req, res, next) => {
  try {
    const review = await Review.findOne({
      where: {
        menteeId: req.params.id,
        userId: req.body.review.userId,
      },
    });
    await review.destroy();
    res.send(review);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
