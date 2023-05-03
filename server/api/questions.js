const Sequelize = require('sequelize');
const router = require('express').Router();
const Questions = require('../db/models/Question');
const Answers = require('../db/models/Answer');
const Cohort = require('../db/models/Cohort');

// GET /api/questions/id
router.get('/:id', async (req, res, next) => {
  try {
    const questions = await Questions.findAll();
    res.send(questions);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
