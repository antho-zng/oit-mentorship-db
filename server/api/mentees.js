const Sequelize = require('sequelize');
const router = require('express').Router();
const Mentees = require('../db/models/Mentee');

// GET /api/mentees
router.get('/', async (req, res, next) => {
  try {
    const mentees = await Mentees.findAll();
    res.send(mentees);
  } catch (error) {
    next(error);
  }
});

// GET mentees/:id
router.get('/:id', async (req, res, next) => {
  console.log(`api req is getting ${req.params.id}`);
  try {
    const mentee = await Mentees.findOne({
      where: {
        id: req.params.id,
      },
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

/**
 * POST / PUT / DELETE requests
 * write after setting up google forms api
 *
 */

// POST mentee

// PUT mentee

// DELETE mentee

module.exports = router;
