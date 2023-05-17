const Sequelize = require('sequelize');
const router = require('express').Router();
const Answers = require('../db/models/Answer');

// GET /api/answers/:id
router.get('/:id', async (req, res, next) => {
  try {
    const answers = await Answers.findAll({
      where: {
        menteeId: req.params.id,
      },
      // include: Question,
    });
    res.send(answers);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
