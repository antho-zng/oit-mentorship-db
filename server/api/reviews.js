const Sequelize = require('sequelize');
const router = require('express').Router();
const Reviews = require('../db/models/Review');

// GET /api/reviews/:id
router.get('/:id', async (req, res, next) => {
  try {
    const reviews = await Reviews.findAll({
      where: {
        menteeId: req.params.id,
      },
    });
    res.send(answers);
  } catch (error) {
    next(error);
  }
});

// POST (creating new review)
router.post();

// PUT (editing review)
router.put();

module.exports = router;
