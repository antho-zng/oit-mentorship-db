const Sequelize = require("sequelize");
const router = require("express").Router();
const Mentees = require("../db/models/Mentee");
const Cohort = require("../db/models/Cohort");
const Question = require("../db/models/Question");
const Review = require("../db/models/Review");
const User = require("../db/models/User");
const { requireUserToken } = require("./middleware/auth-middleware");

// GET /api/mentees
router.get("/", requireUserToken, async (req, res, next) => {
  try {
    const mentees = await Mentees.findAll({
      where: req.query,
      include: [Cohort],
    });
    res.send(mentees);
  } catch (error) {
    next(error);
  }
});

// GET mentees/:id
router.get("/:id", requireUserToken, async (req, res, next) => {
  try {
    const mentee = await Mentees.findOne({
      where: {
        id: req.params.id,
      },
      include: [Cohort, Question, Review],
    });

    if (mentee === null) {
      res.status(404).send();
      return;
    } else {
      res.send(mentee);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
