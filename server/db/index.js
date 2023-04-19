//this is the access point for all things database related!

const db = require('./db');

const User = require('./models/User');
const Mentee = require('./models/Mentee');
const Focus = require('./models/Focus');

// ASSOCIATIONS
Mentee.hasMany(Focus);
Focus.belongsTo(Mentee);

module.exports = {
  db,
  models: {
    User,
    Mentee,
    Focus,
  },
};
