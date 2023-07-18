const router = require('express').Router();
const {
  models: { User },
} = require('../db');
module.exports = router;

router.post('/login', async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body) });
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.send({ token: await user.generateToken() });
  } catch (err) {
    console.log(err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      if (err.errors[0].path === 'username') {
        res
          .status(401)
          .send(
            'This username is already in use. Please select a new username or log in.'
          );
      } else if (err.errors[0].path === 'email') {
        res.status(401).send('This email is already in use. Please log in.');
      }
    } else if (err.name === 'SequelizeValidationError') {
      res.status(401).send('Please enter a valid email.');
    } else {
      next(err);
    }
  }
});

router.get('/me', async (req, res, next) => {
  try {
    res.send(await User.findByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});
