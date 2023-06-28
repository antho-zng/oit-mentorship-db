const router = require('express').Router();
const Cohort = require('../db/models/Cohort');
const Mentees = require('../db/models/Mentee');

// GET /api/cohorts
router.get('/', async (req, res, next) => {
  try {
    const cohorts = await Cohort.findAll();
    res.send(cohorts);
  } catch (error) {
    next(error);
  }
});

// GET api/cohorts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const cohort = await Cohort.findOne({
      where: {
        id: req.params.id,
      },
      include: [Mentees],
    });

    if (cohort === null) {
      res.status(404).send();
      return;
    } else {
      res.send(cohort);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
